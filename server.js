//Install Dependencies
//npm init -y
//npm install express axios 

// backend/server.js
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Fetch stocks from Polygon API
async function fetchStocks() {
  try {
    const response = await axios.get('https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?apiKey=YOUR_POLYGON_API_KEY');
    const stocks = response.data.tickers.slice(0, 20); // Get the first 20 stocks
    const stocksWithRefreshInterval = stocks.map(stock => ({
      ...stock,
      refreshInterval: Math.floor(Math.random() * 5) + 1 // Random refresh interval between 1-5 seconds
    }));
    return stocksWithRefreshInterval;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
}

// Update stock prices with random values
function updateStockPrices(stocks) {
  setInterval(() => {
    stocks.forEach(stock => {
      stock.lastTradePrice = (Math.random() * 1000).toFixed(2); // Random price between 0 and 1000
    });
    fs.writeFileSync(path.join(__dirname, 'data', 'stocks.json'), JSON.stringify(stocks, null, 2));
  }, 1000); // Update every second
}

// API endpoint to fetch stock prices
app.get('/api/stocks', (req, res) => {
  try {
    const stocksData = fs.readFileSync(path.join(__dirname, 'data', 'stocks.json'));
    const stocks = JSON.parse(stocksData);
    res.json(stocks);
  } catch (error) {
    console.error('Error fetching stocks data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);

  // Fetch stocks and update prices
  try {
    const stocks = await fetchStocks();
    updateStockPrices(stocks);
  } catch (error) {
    console.error('Failed to initialize stocks:', error);
  }
});
