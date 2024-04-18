/*npx create-react-app frontend
cd frontend
npm install axios 
*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [stocks, setStocks] = useState([]);
  const [numStocks, setNumStocks] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/stocks?num=${numStocks}`);
        setStocks(response.data);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };

    if (numStocks > 0) {
      fetchData();
      const interval = setInterval(fetchData, 1000); // Fetch data every second
      return () => clearInterval(interval);
    }
  }, [numStocks]);

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumStocks(value > 20 ? 20 : value); // Limit to 20 stocks
  };

  return (
    <div>
      <h1>Stock Prices</h1>
      <input
        type="number"
        min="0"
        max="20"
        value={numStocks}
        onChange={handleInputChange}
      />
      <ul>
        {stocks.map((stock) => (
          <li key={stock.ticker}>
            {stock.ticker}: ${stock.lastTradePrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
