import '../styles/globals.css'
import { CartWrapper } from "../context/CartContext";
function MyApp({ Component, pageProps }) {
  return (
    <CartWrapper>
      <Component {...pageProps} />
    </CartWrapper>
  );
}

export default MyApp;
