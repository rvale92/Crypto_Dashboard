import streamlit as st
import requests
import pandas as pd
import plotly.express as px
import time

st.set_page_config(page_title="Crypto Dashboard", layout="wide")

# Add this dictionary at the top of the file, after the imports
logo_urls = {
    'Bitcoin': 'path/to/bitcoin_logo.png',
    'Ethereum': 'path/to/ethereum_logo.png',
    'Ripple': 'path/to/ripple_logo.png'
}

def fetch_prices():
    try:
        response = requests.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple&vs_currencies=usd&include_24hr_change=true')
        data = response.json()
        return [
            {
                'name': 'Bitcoin',
                'price': data['bitcoin']['usd'],
                'change': data['bitcoin']['usd_24h_change'],
                'logo': logo_urls['Bitcoin']
            },
            {
                'name': 'Ethereum',
                'price': data['ethereum']['usd'],
                'change': data['ethereum']['usd_24h_change'],
                'logo': logo_urls['Ethereum']
            },
            {
                'name': 'Ripple',
                'price': data['ripple']['usd'],
                'change': data['ripple']['usd_24h_change'],
                'logo': logo_urls['Ripple']
            }
        ]
    except Exception as e:
        st.error(f"Error fetching prices: {e}")
        return []

st.title("Crypto Dashboard")

if st.button('Refresh'):
    prices = fetch_prices()
    st.session_state.prices = prices
else:
    if 'prices' not in st.session_state:
        st.session_state.prices = fetch_prices()
    prices = st.session_state.prices

if prices:
    df = pd.DataFrame(prices)
    st.dataframe(df)

    fig = px.line(df, x='name', y='price', title='Crypto Prices')
    st.plotly_chart(fig)

    for coin in prices:
        st.metric(
            label=f"{coin['name']}  ![logo]({coin['logo']})",
            value=f"${coin['price']:,.2f}",
            delta=f"{coin['change']:.2f}%"
        )

st.text("Updating every 30 seconds...")
time.sleep(30)  # Simulate update interval
st.experimental_rerun()
