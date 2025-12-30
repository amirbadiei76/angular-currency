# Arzyab

**Arzyab** is a real-time market price tracking web application built with **Angular 19** and **Tailwind CSS**.  
It provides up-to-date prices, charts, and detailed insights across multiple financial markets, including currencies, gold, cryptocurrencies, metals, and commodities.

🔗 **Live Website:** https://arzyab.vercel.app/

---

## Overview

Arzyab is designed as a **personal portfolio project** and a **reference implementation** for developers interested in building modern, data-driven financial applications with Angular.

The application consumes **public market APIs** and updates data **in real time**, offering users an interactive and responsive experience across desktop and mobile devices.

---

## Key Features

### 📊 Market Coverage
- Currency markets
- Gold and precious metals
- Coins market
- Cryptocurrencies
- Base metals
- Commodities


### ⚡ Real-Time Data Updates
- Market data is updated live based on API changes
- A custom Node.js service (deployed separately) listens for changes in source data and pushes updates to the frontend
- No manual refresh required


### 💱 Price Converters
- Currency to currency conversion
- Cryptocurrency to cryptocurrency conversion
- Cryptocurrency to fiat currency conversion
- All conversions reflect live market rates


### 🧮 Gold Calculator
- Gold price calculation (18K, 24K, melted gold)
- Gold unit conversions:
  - Gram ↔ Mithqal
  - Gram ↔ Carat
  - Carat ↔ Sot
  - Sot ↔ Mithqal
- Calculations update dynamically based on live prices


### 📈 Asset Detail Pages
Each asset (currency, gold, crypto, etc.) has a dedicated detail page including:

- Live price and daily change
- **Market snapshot** (at-a-glance status)
- Top 5 gainers and top 5 losers
- Interactive charts:
  - Line chart
  - Candlestick chart
  - Multiple time ranges
  - Grouped candlestick intervals
- Historical price table
- Installable PWA (Add to Home Screen)
- Shareable price link


### 🎨 UI & UX
- Fully responsive design
- Clean and minimal UI using Tailwind CSS
- Optimized for both desktop and mobile users

---

## Tech Stack

- **Frontend:** Angular 19
- **Styling:** Tailwind CSS
- **Rendering:** Angular Universal (SSR enabled)
- **Data Sources:**
  - Public API: https://call1.tgju.org/ajax.json
  - PriceDB reference: https://github.com/margani/pricedb
- **Backend (optional):**
  - Custom Node.js service for real-time updates (not yet published)

---

## Installation & Development

```bash
npm install
ng serve
```
The application will be available at ```http://localhost:4200```.

---

## Project Status

- Actively developed
- Used as a personal project and portfolio showcase
- Backend real-time service may be published in the future

---

## Contributing

Contributions are welcome.\
\
UI/UX Designed by:\
Amir Tehrani – https://github.com/Amir-Trax
\
\
If you have suggestions, improvements, or bug fixes, feel free to open a pull request.

---
## Disclaimer

Arzyab displays market data for informational purposes only.
Prices are sourced from public APIs and may not reflect exact market trading values.

---
## License

License has not been finalized yet.
This project is intended for learning, experimentation, and frontend code reuse.
