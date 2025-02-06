import streamlit as st
import pandas as pd
import requests
import time
import plotly.express as px

# Function to verify image URLs
def is_valid_image(url):
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return url
    except:
        pass
    return "https://via.placeholder.com/50"  # Fallback image

# Crypto image URLs
image_map = {
    "BTC": "https://www.cryptocompare.com/media/37746251/btc.png",
    "ETH": "https://www.cryptocompare.com/media/37746238/eth.png",
    "XRP": "https://www.cryptocompare.com/media/38553096/xrp.png"
}

# Function to fetch crypto data (replace with actual API if needed)
def get_crypto_data():
    return [
        {"name": "Bitcoin", "price": 97301.00, "change": -1.43, "symbol": "BTC"},
        {"name": "Ethereum", "price": 2802.67, "change": 3.32, "symbol": "ETH"},
        {"name": "XRP", "price": 2.42, "change": -2.56, "symbol": "XRP"},
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
    col1, col2 = st.columns([1, 5])
    
    with col1:
        image_url = is_valid_image(image_map.get(row["symbol"], ""))
        st.image(image_url, width=50)

    with col2:
        st.markdown(f"**{row['name']}**")
        st.write(f"💰 ${row['price']:.2f}")
        change_color = "🔺" if row["change"] > 0 else "🔻"
        st.write(f"{change_color} {row['change']}%")

# Convert data for chart
df_chart = df[["name", "price"]]
fig = px.line(df_chart, x="name", y="price", title="Crypto Prices")

# Show Chart
st.plotly_chart(fig)

# Auto-update
st.write("🔄 Updating every 30 seconds...")
time.sleep(30)
st.experimental_rerun()
