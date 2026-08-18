class QuoteCalculator {
    /**
     * Calculates the estimated value of a device based on its conditions and pricing rules.
     * @param {Object} conditions - The device conditions selected by the user.
     * @param {Array} devicesDb - The devices database.
     * @param {Object} pricingMatrix - The pricing rules matrix.
     * @returns {Object} The calculated quote breakdown.
     */
    static calculate(conditions, devicesDb, pricingMatrix) {
        // Step 1 & 2: Load Device & Base Value
        const device = devicesDb.find(d => 
            d.brand.toLowerCase() === conditions.brand.toLowerCase() && 
            d.model.toLowerCase() === conditions.model.toLowerCase() && 
            d.variant.toLowerCase() === conditions.variant.toLowerCase()
        );
        if (!device) {
            throw new Error(`Device not found: ${conditions.brand} ${conditions.model} ${conditions.variant}`);
        }
        
        let basePrice = device.base_price || 0;
        let tier = device.tier || 'Tier1';
        let deviceName = `${conditions.brand} ${conditions.model} (${conditions.variant})`;
        
        // Step 3: Load Tier Pricing Rules
        const brandRules = pricingMatrix[conditions.brand];
        if (!brandRules) {
            throw new Error(`Pricing rules not found for brand: ${conditions.brand}`);
        }
        const rules = brandRules[tier];
        if (!rules) {
            throw new Error(`Pricing rules not found for brand: ${conditions.brand} (${tier})`);
        }
        
        // Warranty Void Protocol
        let ageCondition = conditions.age;
        const warrantyAges = ['0-3_months', '3-6_months', '6-11_months'];
        if (warrantyAges.includes(ageCondition)) {
            const severeDisplays = ['cracked', 'faulty', 'dead', 'changed'];
            const severePhysicals = ['broken_back', 'bent'];
            const severeHardware = ['biometric', 'water_damage'];
            
            const isVoid = severeDisplays.includes(conditions.display) ||
                           severePhysicals.includes(conditions.physical) ||
                           conditions.hardware.some(hw => severeHardware.includes(hw));
                           
            if (isVoid) {
                ageCondition = 'out_of_warranty';
            }
        }
        
        const deductions = [];
        
        // Age deduction
        if (ageCondition) {
            const ageDeductionRules = rules.age || {};
            const val = ageDeductionRules[ageCondition] || 0;
            if (val > 0) {
                deductions.push({
                    reason: `Age: ${ageCondition.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
                    amount: val,
                    is_percentage: true
                });
            }
        }
        
        // Display deduction
        if (conditions.display) {
            const displayDeductionRules = rules.display || {};
            const val = displayDeductionRules[conditions.display] || 0;
            if (val > 0) {
                deductions.push({
                    reason: `Display: ${conditions.display.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
                    amount: val,
                    is_percentage: true
                });
            }
        }
        
        // Physical deduction
        if (conditions.physical) {
            const physicalDeductionRules = rules.physical || {};
            let val = physicalDeductionRules[conditions.physical];
            if (val === undefined) {
                const hardwareDeductionRules = rules.hardware || {};
                val = hardwareDeductionRules[conditions.physical] || 0;
            }
            if (val > 0) {
                deductions.push({
                    reason: `Physical Condition: ${conditions.physical.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
                    amount: val,
                    is_percentage: true
                });
            }
        }
        
        // Hardware deductions
        if (conditions.hardware && conditions.hardware.length > 0) {
            const hardwareDeductionRules = rules.hardware || {};
            conditions.hardware.forEach(hw => {
                const val = hardwareDeductionRules[hw] || 0;
                if (val > 0) {
                    deductions.push({
                        reason: `Hardware Issue: ${hw.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
                        amount: val,
                        is_percentage: true
                    });
                }
            });
        }
        
        // Validate and Adjust Hardware Cap
        const maxHardwareCap = rules.max_hardware_cap !== undefined ? rules.max_hardware_cap : 100;
        const hwPct = deductions
            .filter(d => d.is_percentage && d.reason.includes('Hardware'))
            .reduce((sum, d) => sum + d.amount, 0);
            
        if (hwPct > maxHardwareCap) {
            const adjustment = hwPct - maxHardwareCap;
            deductions.push({
                reason: `Limit: Max Hardware Cap Applied (${maxHardwareCap}%)`,
                amount: -adjustment,
                is_percentage: true
            });
        }
        
        const totalDeductionPercentage = deductions.reduce((sum, d) => sum + d.amount, 0);
        const totalDeductionValue = (basePrice * totalDeductionPercentage) / 100;
        
        // Accessories Flat Deductions
        const flatDeductions = [];
        const accessoryRules = rules.accessories || {};
        const maxAccessoryDeduction = rules.max_accessory_deduction !== undefined ? rules.max_accessory_deduction : 2000;
        let totalAccessoryDeduction = 0;
        
        Object.keys(accessoryRules).forEach(acc => {
            const penalty = accessoryRules[acc] || 0;
            if (!conditions.accessories.includes(acc) && penalty > 0) {
                flatDeductions.push({
                    reason: `Missing Accessory: ${acc.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
                    amount: penalty,
                    is_percentage: false
                });
                totalAccessoryDeduction += penalty;
            }
        });
        
        if (totalAccessoryDeduction > maxAccessoryDeduction) {
            const adjustment = totalAccessoryDeduction - maxAccessoryDeduction;
            flatDeductions.push({
                reason: "Limit: Max Accessory Deduction Cap Applied",
                amount: -adjustment,
                is_percentage: false
            });
        }
        
        let totalFlatDeductionValue = flatDeductions.reduce((sum, d) => sum + d.amount, 0);
        
        // Final Valuation & Minimum Floor Price Enforcement
        let calculatedValue = basePrice - totalDeductionValue - totalFlatDeductionValue;
        const floorPrice = rules.floor_price !== undefined ? rules.floor_price : 0;
        let finalEstimatedValue = calculatedValue;
        
        if (calculatedValue < floorPrice) {
            const adjustment = floorPrice - calculatedValue;
            flatDeductions.push({
                reason: "Limit: Minimum Floor Price Enforced",
                amount: -adjustment,
                is_percentage: false
            });
            totalFlatDeductionValue -= adjustment;
            finalEstimatedValue = floorPrice;
        }
        
        return {
            device_name: deviceName,
            base_value: basePrice,
            tier: tier,
            deductions: deductions,
            flat_deductions: flatDeductions,
            total_deduction_percentage: totalDeductionPercentage,
            total_deduction_value: totalDeductionValue,
            total_flat_deduction_value: totalFlatDeductionValue,
            final_estimated_value: finalEstimatedValue
        };
    }
}
window.QuoteCalculator = QuoteCalculator;
