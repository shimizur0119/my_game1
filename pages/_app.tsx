import 'destyle.css/destyle.css';
import "nes.css/css/nes.min.css";
import "../styles/common.scss"
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default MyApp
