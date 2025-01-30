import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { RefreshCw, ArrowUp, ArrowDown } from 'lucide-react';

export default function CryptoDashboard() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []); // Added dependency array

  const fetchPrices = async () => {
    try {
      const response = await fetch(
        'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,XRP&tsyms=USD&api_key=33b4a3f0dd821573ed1c47331c8d0ec7aa886644e91bf4cd0b3d49acb86bc87f'
      );
      const data = await response.json();
      
      const formattedData = Object.entries(data.RAW).map(([coinSymbol, coinData]) => {
        const usdData = coinData.USD;
        // Handle different possible image URL formats
        const imageUrl = usdData.IMAGEURL;
        const fullImageUrl = imageUrl?.startsWith('http') 
          ? imageUrl 
          : `https://www.cryptocompare.com${imageUrl}`;
          
        return {
          name: usdData.FROMSYMBOL,
          price: usdData.PRICE,
          change: usdData.CHANGEPCT24HOUR,
          logo: fullImageUrl
        };
      });
      
      setPrices(formattedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prices:', error);
      setLoading(false);
    }
  };

  const handleImageError = (coinName) => {
    setImageErrors(prev => ({
      ...prev,
      [coinName]: true
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Crypto Dashboard</h1>
        <button
          onClick={fetchPrices}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {prices.map((coin) => (
            <div key={coin.name} className="p-4 border rounded-lg shadow">
              <div className="flex items-center mb-2">
                {!imageErrors[coin.name] && coin.logo && (
                  <img
                    src={coin.logo}
                    alt={`${coin.name} logo`}
                    className="w-6 h-6 mr-2 object-contain"
                    onError={() => handleImageError(coin.name)}
                  />
                )}
                <h2 className="text-xl font-semibold">{coin.name}</h2>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl">${coin.price.toLocaleString()}</span>
                <div className={`flex items-center ${coin.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {coin.change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  <span className="ml-1">{Math.abs(coin.change).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <LineChart width={800} height={300} data={prices}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      </div>
    </div>
  );
}
