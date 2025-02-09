import streamlit as st
import pandas as pd
import requests
import time
import plotly.express as px

# Function to verify image URLs (with debug prints)
def is_valid_image(url):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Testing URL: {url} | Status Code: {response.status_code}")  # Debug
        return url if response.status_code == 200 else "https://via.placeholder.com/50"
    except Exception as e:
        print(f"Error fetching {url}: {str(e)}")  # Debug
        return "https://via.placeholder.com/50"

# Updated CoinGecko image map with more coins
image_map = {
    "BTC": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    "ETH": "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    "XRP": "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    "BNB": "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    "DOGE": "https://assets.coingecko.com/coins/images/5/large/dogecoin.png"
}

# Fetch crypto data (replace with your actual API call)
def get_crypto_data():
    # Example data - ensure symbols match image_map keys EXACTLY
    return [
        {"symbol": "BTC", "name": "Bitcoin", "price": 30000, "change": 2.5},
        {"symbol": "ETH", "name": "Ethereum", "price": 1800, "change": -1.2},
        {"symbol": "XRP", "name": "XRP", "price": 0.5, "change": 0.7},
        {"symbol": "BNB", "name": "Binance Coin", "price": 250, "change": 0.3},
        {"symbol": "DOGE", "name": "Dogecoin", "price": 0.08, "change": 4.1}
    ]

# Fetch data
df = pd.DataFrame(get_crypto_data())

# Streamlit UI
st.title("🚀 Crypto Dashboard")

# Debug: Show raw symbols from API
st.write("Debug - Symbols from API:", df["symbol"].tolist())  # Check case/symbols here!

# Display crypto data
st.subheader("💰 Live Crypto Prices")
for _, row in df.iterrows():
    symbol = row["symbol"].strip().upper()  # Force uppercase + remove whitespace
    image_url = is_valid_image(image_map.get(symbol, ""))
    
    # Use HTML/CSS for guaranteed alignment
    st.markdown(
        f"""
        <div style="display: flex; align-items: center; gap: 15px; margin: 10px 0;">
            <img src="{image_url}" width="50">
            <div>
                <h4 style="margin: 0;">{row['name']} ({symbol})</h4>
                <p style="margin: 0;">Price: ${row['price']:.2f}</p>
                <p style="margin: 0; color: {'#00ff00' if row['change'] > 0 else '#ff0000'}">
                    {row['change']:.2f}% {"▲" if row['change'] > 0 else "▼"}
                </p>
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )

# Price chart
fig = px.line(df, x="name", y="price", title="Price Trends")
st.plotly_chart(fig)

# Auto-refresh
st.write("🔄 Auto-refreshing every 30 seconds...")
time.sleep(30)
st.experimental_rerun()
