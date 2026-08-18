# GADDZY Price Engine Model 📱💻⌚

Welcome to the **GADDZY Price Engine Model** codebase! This project is a premium, serverless, client-side web application designed to calculate the resale value of old smartphones instantly.

It features a high-fidelity landing page, a clean multi-page quote funnel, and an automated valuation engine running entirely in the browser.

---

## 📁 Project Structure

Here is a quick map of the project files to help you get started:

```text
├── data/
│   ├── devices_db.json         # Database of all supported phone models, variants, base prices, and tiers
│   └── pricing_matrix.json     # Deduction percentage and penalty rules grouped by brand and tier
│
├── pages/                      # HTML template views for each step of the quote funnel
│   ├── brand.html              # Step 1: Select Brand & search box
│   ├── model.html              # Step 2: Select Brand Model (includes series filter tab)
│   ├── varient.html            # Step 3: Select variant (RAM/Storage) & estimated base price preview
│   └── price.html              # Step 4: Condition questionnaire & final calculated price breakdown
│
├── static/                     # Static assets (stylesheets, scripts, images)
│   ├── css/
│   │   ├── style.css           # Global quote engine styles (grid layout, buttons, custom badges)
│   │   └── landing/
│   │       └── landing.css     # Cleaned styles specifically for the homepage
│   │
│   ├── js/
│   │   ├── engine.js           # Client-side JavaScript pricing calculation engine (replacement for Python engine)
│   │   └── landing/
│   │       └── landing.js      # Actions, location selectors, and sliders for the homepage
│   │
│   └── images/                 # Product shots, brand logos, and deduction condition icons
│
└── index.html                  # Root landing page (Entry point of the GADDZY application)
```

---

## ⚙️ How the Quote Funnel Navigation Works

The application runs **without a server (serverless)**. Navigation between pages is done using **browser URL query parameters**:

1. **Category Selection (`index.html`)**: Clicking **Mobile Phone** directs the user to `pages/brand.html`.
2. **Brand Selection (`brand.html`)**: Selecting a brand (e.g. *Apple*) directs the user to `model.html?brand=Apple`.
3. **Model Selection (`model.html`)**: Selecting a model (e.g. *Apple iPhone 15*) directs the user to `varient.html?brand=Apple&model=Apple+iPhone+15`.
4. **Variant Selection (`varient.html`)**: Selecting a variant (e.g. *128GB*) directs the user to `price.html?brand=Apple&model=Apple+iPhone+15&variant=128GB`.
5. **Valuation (`price.html`)**: Parses the URL query parameters, runs the questionnaire steps, and computes the final quote.

Each page uses `URLSearchParams` in JavaScript to read the incoming selections:
```javascript
const urlParams = new URLSearchParams(window.location.search);
const selectedBrandName = urlParams.get('brand');
const selectedModelName = urlParams.get('model');
const selectedVariantName = urlParams.get('variant');
```

---

## 🧮 How the Valuation Engine Works (`engine.js`)

All calculations run in the browser using the JavaScript class `QuoteCalculator` inside [static/js/engine.js](static/js/engine.js).

When the user clicks **Calculate Quote**, the engine performs the following checks in order:

### 1. Device Lookup & Base Price
It looks up the device in `devices_db.json` by brand, model, and variant to load its `base_price` and rules `tier` (e.g. *Tier1* or *Tier2*).

### 2. Warranty Void Protocol
If the device is under warranty (selected age is `0-3 months`, `3-6 months`, or `6-11 months`), it checks if any severe issues exist:
- **Severe Display issues**: *cracked, faulty, dead, or changed display*
- **Severe Physical issues**: *broken back, or bent housing*
- **Severe Hardware issues**: *biometric scanner fault, or water damage*

If any of these conditions are met, the device's age is automatically overridden to **Out of Warranty**, invoking standard age deductions.

### 3. Percentage Deductions
The engine evaluates and subtracts percentage-based deductions loaded from `pricing_matrix.json` for the brand/tier:
* **Age Deduction**: Penalty based on device age.
* **Display Condition**: Penalty based on scratches or crack severity.
* **Physical Condition**: Penalty based on side dents or back panel wear.
* **Hardware Issues**: Accumulates penalties for each unchecked component.

### 4. Hardware Deduction Cap
To prevent excessive price drops due to multiple small hardware faults, the sum of **Hardware penalties** is capped at the brand's `max_hardware_cap` parameter (e.g. *70% max*).

### 5. Flat Accessory Deductions
If the user is missing any required accessories (Box, Charger, or Bill), a flat monetary amount is deducted:
- Missing items are summed up and capped at `max_accessory_deduction` (default limit of *₹2,000*).

### 6. Minimum Floor Price Enforcement
The final calculated value is checked against the brand's defined `floor_price`. If the deductions drop the price below the floor, the engine adjusts the deductions to ensure the user receives the minimum floor price.

---

## 🚀 How to Run the Project

Since GADDZY is completely serverless, there are **no backend servers or databases to run**!

1. Open the project directory in **VS Code**.
2. Install the **Live Server** extension.
3. Right-click [index.html](index.html) and select **Open with Live Server**.
4. The page will open at `http://127.0.0.1:5500/` and is fully functional.

---

## ✏️ Customizing Database & Rules

### Adding New Phones
To add a new device, append a new object to [data/devices_db.json](data/devices_db.json):
```json
{
  "brand": "Apple",
  "model": "Apple iPhone 18 Pro",
  "variant": "16GB/512GB",
  "base_price": 125000,
  "tier": "Tier1"
}
```

### Modifying Deduction Penalties
To adjust rules or percentage deductions, edit [data/pricing_matrix.json](data/pricing_matrix.json) for the target brand and tier group.
