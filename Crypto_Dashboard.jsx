from flask import Flask, render_template, jsonify
import requests
from datetime import datetime
import schedule

app = Flask(__name__)

@app.route('/')
def crypto_dashboard():
  const [prices, setPrices] = useState([]);
  loading = True

  def update_prices():
      fetchPrices()
      return schedule.every(30).seconds.do(fetchPrices)
  
  def fetch_prices():
      try:
          response = requests.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple&vs_currencies=usd&include_24hr_change=true')
          data = response.json()
          prices = [
        {
          name: 'Bitcoin',
          price: data.bitcoin.usd,
          change: data.bitcoin.usd_24h_change
        },
        {
          name: 'Ethereum',
          price: data.ethereum.usd,
          change: data.ethereum.usd_24h_change
        },
        {
          name: 'Ripple',
          price: data.ripple.usd,
          change: data.ripple.usd_24h_change
        }
      ]
      loading = False
      setPrices(prices)
  except Exception as error:
      print('Error fetching prices:', error)
      loading = False
      setPrices([])

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
              <h2 className="text-xl font-semibold mb-2">{coin.name}</h2>
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