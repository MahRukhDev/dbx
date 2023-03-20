import { createContext } from "react";

let API_KEY_INFURA = process.env.REACT_APP_API_KEY_INFURA;
export const initialChain = {
    chain: {
        deb0xAddress: "0x4F3ce26D9749C0f36012C9AbB41BF9938476c462",
        deb0xViewsAddress: "0xE8696A871C5eaB13bA566A4C15b8144AFeEAFfbA",
        deb0xERC20Address: "0x47DD60FA40A050c0677dE19921Eb4cc512947729",
        xenCryptoAddress: "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e",
        chainId: "137",
        chainName: "polygon",
        currency: "MATIC",
        priceURL: `https://polygon-mainnet.infura.io/v3/${API_KEY_INFURA}`,
        dxnTokenName: "mDXN"
    },
    setChain: (_value: any) => {}
}

const ChainContext = createContext(initialChain);
export default ChainContext;