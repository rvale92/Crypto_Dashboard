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
        if response.status_code == 200:
            return url
    except:
        pass
    return "https://via.placeholder.com/50"

# Updated Crypto image URLs (CoinGecko)
image_map = {
    "BTC": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
    "ETH": "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    "XRP": "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1605778731"
}

# Rest of your code remains the same...

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
