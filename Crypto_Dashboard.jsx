import streamlit as st
import pandas as pd
import requests
import time
import plotly.express as px

# Function to verify image URLs with User-Agent header
def is_valid_image(url):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers, timeout=5)
        st.write(f"URL: {url} - Status Code: {response.status_code}")
        if response.status_code == 200:
            return url
    except Exception as e:
        st.write(f"URL: {url} - Error: {e}")
    return "https://via.placeholder.com/50"  # Fallback image

# CoinGecko image URLs (uppercase keys)
image_map = {
    "BTC": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
    "ETH": "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    "XRP": "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1605778731"
}

# Function to fetch crypto data (replace with your API logic)
def get_crypto_data():
    # Example dummy data - replace with actual API call
    return [
        {"symbol": "BTC", "name": "Bitcoin", "price": 30000, "change": 2.5},
        {"symbol": "ETH", "name": "Ethereum", "price": 1800, "change": -1.2},
        {"symbol": "XRP", "name": "XRP", "price": 0.5, "change": 0.7}
    ]

# Fetch data
df = pd.DataFrame(get_crypto_data())

# Streamlit Layout
st.title("🚀 Crypto Dashboard")

# Refresh Button
if st.button("🔄 Refresh Data"):
    st.experimental_rerun()

# Display Crypto Data with Images
st.subheader("💰 Live Crypto Prices")
for _, row in df.iterrows():
    col1, col2 = st.columns([1, 5])  # Image + Text columns
    
    with col1:
        # Use uppercase symbol to match image_map keys
        symbol_upper = row["symbol"].upper()
        image_url = is_valid_image(image_map.get(symbol_upper, ""))
        st.image(image_url, width=50)

    with col2:
        st.markdown(f"**{row['name']}**")
        st.write(f"💰 ${row['price']:.2f}")
        change_color = "🔺" if row["change"] > 0 else "🔻"
        st.write(f"{change_color} {row['change']}%")

# Price Chart
df_chart = df[["name", "price"]]
fig = px.line(df_chart, x="name", y="price", title="Crypto Prices")
st.plotly_chart(fig)

# Auto-update
st.write("🔄 Updating every 30 seconds...")
time.sleep(30)
st.experimental_rerun()
