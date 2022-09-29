import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import {
  hooks as metaMaskHooks,
  metaMask,
} from "../WalletHelpers/connectors/metaMask";
import {
  hooks as walletConnectHooks,
  walletConnect,
} from "../WalletHelpers/connectors/walletConnect";
import {
  coinbaseWallet,
  hooks as coinbaseWalletHooks,
} from "../WalletHelpers/connectors/coinbaseWallet";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";

const connectors: [
  MetaMask | WalletConnect | CoinbaseWallet,
  Web3ReactHooks
][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [coinbaseWallet, coinbaseWalletHooks],
];

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <Web3ReactProvider connectors={connectors}>
      <Component {...pageProps} />
    </Web3ReactProvider>
    </>
  )
}

export default MyApp
