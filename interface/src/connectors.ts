
import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'

// const POLLING_INTERVAL = 12000
const RPC_URLS: { [chainId: number]: string } = {
    137: 'https://polygon-mainnet.infura.io/v3/6010818c577b4531b1886965421a91d3',
    43114: 'https://avalanche-mainnet.infura.io/v3/6010818c577b4531b1886965421a91d3',
    56: 'https://bsc.rpc.blxrbdn.com',
    250: 'https://endpoints.omniatech.io/v1/fantom/mainnet/public'
}

export const injected = new InjectedConnector({ supportedChainIds: [137, 43114, 56,250 ] })

export const network = new NetworkConnector({
    urls: { 137: RPC_URLS[137], 43114: RPC_URLS[43114], 56: RPC_URLS[56],  250: RPC_URLS[250]},
    defaultChainId: 137
})