import Popper from '@mui/material/Popper';
import { useContext, useEffect, useState } from "react";
import ChainContext from "./ChainContext";
import polygon from "../../photos/icons/polygon.svg";
import avalanche from "../../photos/icons/avalanche.svg";
import bnb from "../../photos/icons/bnb.svg";
import fantom from "../../photos/icons/fantom.svg";
import moonbeam from "../../photos/icons/moonbeam.svg";
import okx from "../../photos/icons/okx.svg";
import evmos from "../../photos/icons/evmos.svg";
import dc from "../../photos/icons/dc.svg";
import ethpow from "../../photos/icons/ethpow.svg";
import ClickAwayListener from '@mui/base/ClickAwayListener';

const networks: any = {
    polygon: {
      chainId: `0x${Number(137).toString(16)}`,
      chainName: "Polygon Mainnet",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18
      },
      rpcUrls: ["https://rpc-mainnet.maticvigil.com"],
      blockExplorerUrls: ["https://polygonscan.com/"]
    },
    avalanche: {
        chainId: `0x${Number(43114).toString(16)}`,
        chainName: "Avalanche Mainnet C-Chain",
        nativeCurrency: {
          name: "Avalanche",
          symbol: "AVAX",
          decimals: 18,
        },
        rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
        blockExplorerUrls: ["https://snowtrace.io/"],
    },
    binance:{
        chainId: `0x${Number(56).toString(16)}`,
        chainName: 'Binance Smart Chain',
        nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'BNB',
            decimals: 18
        },
        rpcUrls: ['https://bsc.rpc.blxrbdn.com'],
        blockExplorerUrls: ['https://bscscan.com'] 
    },
    fantom:{
        chainId: `0x${Number(250).toString(16)}`,
        chainName: 'Fantom Opera',
        nativeCurrency: {
            name: 'Fantom Token',
            symbol: 'FTM',
            decimals: 18
        },
        rpcUrls: ['https://endpoints.omniatech.io/v1/fantom/mainnet/public'],
        blockExplorerUrls: ['https://ftmscan.com'] 
    },
    moonbeam:{
        chainId: `0x${Number(1284).toString(16)}`,
        chainName: 'Moonbeam',
        nativeCurrency: {
            name: 'Moonbeam',
            symbol: 'GLMR',
            decimals: 18
        },
        rpcUrls: ['https://moonbeam.api.onfinality.io/public'],
        blockExplorerUrls: ['https://moonscan.io'] 
    },
    okx:{
        chainId: `0x${Number(66).toString(16)}`,
        chainName: 'OKXChain Mainnet',
        nativeCurrency: {
            name: 'OKXChain Token',
            symbol: 'OKT',
            decimals: 18
        },
        rpcUrls: ['https://exchainrpc.okex.org'],
        blockExplorerUrls: ['https://www.oklink.com/en/okc'] 
    },
    evmos: {
            chainId: `0x${Number(9001).toString(16)}`,
            chainName: 'Evmos',
            nativeCurrency: {
                name: 'Evmos',
                symbol: 'EVMOS',
                decimals: 18
            },
            rpcUrls: ['https://eth.bd.evmos.org:8545'],
            blockExplorerUrls: ['https://escan.live'] 
    },
    doge: {
        chainId: `0x${Number(2000).toString(16)}`,
        chainName: 'Dogechain Mainnet',
        nativeCurrency: {
            name: 'Dogechain Token',
            symbol: 'DC',
            decimals: 18
        },
        rpcUrls: ['https://rpc.dogechain.dog'],
        blockExplorerUrls: ['https://explorer.dogechain.dog'] 
},
ethpow: {
    chainId: `0x${Number(10001).toString(16)}`,
    chainName: 'Ethereum PoW',
    nativeCurrency: {
        name: 'EthereumPoW',
        symbol: 'ETHW',
        decimals: 18
    },
    rpcUrls: ['https://mainnet.ethereumpow.org'],
    blockExplorerUrls: ['https://www.oklink.com/en/ethw/'] 
}
};

export default function ChainSetter(props: any) {
    const { chain, setChain } = useContext(ChainContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [open, setOpen] = useState<any>(false);
    const id = open ? 'simple-popper' : "";

    useEffect(() => {
        window.ethereum.on("chainChanged", networkChanged);

        return () => {
            window.ethereum.removeListener("chainChanged", networkChanged);
            };
    }, [])

    const changeNetwork = async ({ networkName, setError }: any) => {
        try {
            if (!window.ethereum) throw new Error("No crypto wallet found");
            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        ...networks[networkName]
                    }
                ]
            }).then((result: any) => {
                switch(parseInt(result, 16)) {
                    case 137: 
                        setChain({
                            deb0xAddress: "0x4F3ce26D9749C0f36012C9AbB41BF9938476c462",
                            deb0xViewsAddress: "0xE8696A871C5eaB13bA566A4C15b8144AFeEAFfbA",
                            deb0xERC20Address: "0x47DD60FA40A050c0677dE19921Eb4cc512947729",
                            xenCryptoAddress: "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e",
                            chainId: parseInt(result, 16),
                            chainName: "polygon",
                            currency: "MATIC",
                            priceURL: "https://polygon-mainnet.infura.io/v3/6010818c577b4531b1886965421a91d3"
                        })
                        break;
                    case 43114: 
                        setChain({
                            deb0xAddress: "0xF5c80c305803280B587F8cabBcCdC4d9BF522AbD",
                            deb0xViewsAddress: "0x67873aDDc934C6A1C4b2Bd6d2e08D4431d1181fD",
                            deb0xERC20Address: "0x80f0C1c49891dcFDD40b6e0F960F84E6042bcB6F",
                            xenCryptoAddress: "0xC0C5AA69Dbe4d6DDdfBc89c0957686ec60F24389",
                            chainId: parseInt(result, 16),
                            chainName: "avalanche",
                            currency: "AVAX",
                            priceURL: "https://avalanche-mainnet.infura.io/v3/6010818c577b4531b1886965421a91d3"
                        })
                        break;
                    case 56:
                        setChain({
                            deb0xAddress: "0x9caf6C4e5B9E3A6f83182Befd782304c7A8EE6De",
                            deb0xViewsAddress: "0xA0C192aE0C75FDE64A42D9f0430e7163Fd6701e5",
                            deb0xERC20Address: "0xCcd09b80453335aa914f5d9174984b6586c315EC",
                            xenCryptoAddress: "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e",
                            chainId: parseInt(result, 16),
                            chainName: "binance",
                            currency: "BNB",
                            priceURL: "https://bsc-mainnet.gateway.pokt.network/v1/lb/b1ad9a15615e95af1a87f86d"
                        })
                        break;
                        case 250:
                            setChain({
                                deb0xAddress: "0xAEC85ff2A37Ac2E0F277667bFc1Ce1ffFa6d782A",
                                deb0xViewsAddress: "0x5f8cABEa25AdA7DB13e590c34Ae4A1B1191ab997",
                                deb0xERC20Address: "0x24b8cd32f93aC877D4Cc6da2369d73a6aC47Cb7b",
                                xenCryptoAddress: "0xeF4B763385838FfFc708000f884026B8c0434275",
                                chainId: parseInt(result, 16),
                                chainName: "fantom",
                                currency: "FTM",
                                priceURL: "https://fantom-mainnet.gateway.pokt.network/v1/lb/b1ad9a15615e95af1a87f86d"
                            })
                            break;
                            case 1284:
                                setChain({
                                    deb0xAddress: "0xaec85ff2a37ac2e0f277667bfc1ce1fffa6d782a",
                                    deb0xViewsAddress: "0xdea7280c879bd503bf7e1a8e5a4b99dfd7577c00",
                                    deb0xERC20Address: "0x24b8cd32f93aC877D4Cc6da2369d73a6aC47Cb7b",
                                    xenCryptoAddress: "0xb564A5767A00Ee9075cAC561c427643286F8F4E1",
                                    chainId: parseInt(result, 16),
                                    chainName: "moonbeam",
                                    currency: "GLMR",
                                    priceURL: "https://moonbeam-mainnet.gateway.pokt.network/v1/lb/b1ad9a15615e95af1a87f86d"
                                })
                                break;
                            case 66:
                                    setChain({
                                        deb0xAddress: "0xaec85ff2a37ac2e0f277667bfc1ce1fffa6d782a",
                                        deb0xViewsAddress: "0x5f8cabea25ada7db13e590c34ae4a1b1191ab997",
                                        deb0xERC20Address: "0x24b8cd32f93aC877D4Cc6da2369d73a6aC47Cb7b",
                                        xenCryptoAddress: "0x1cC4D981e897A3D2E7785093A648c0a75fAd0453",
                                        chainId: parseInt(result, 16),
                                        chainName: "okx",
                                        currency: "OKT",
                                        priceURL: "https://oKc-mainnet.gateway.pokt.network/v1/lb/b1ad9a15615e95af1a87f86d"
                                    })
                                    break;
                            case 9001:
                                    setChain({
                                        deb0xAddress: "0xdeA7280c879BD503bF7E1A8e5A4B99dfD7577C00",
                                        deb0xViewsAddress: "0x624A755fcd3F68351565d264A5Bf2Ed71EF4B0d2",
                                        deb0xERC20Address: "0xA26a487E485470a51377080762c1196fC47fE9Ad",
                                        xenCryptoAddress: "0x2ab0e9e4ee70fff1fb9d67031e44f6410170d00e",
                                        chainId: parseInt(result, 16),
                                        chainName: "Evmos",
                                        currency: "EVMOS",
                                        priceURL: "https://evmos-mainnet.gateway.pokt.network/v1/lb/b1ad9a15615e95af1a87f86d"
                                    })
                                    break;
                            case 2000:
                                    setChain({
                                        deb0xAddress: "0xAEC85ff2A37Ac2E0F277667bFc1Ce1ffFa6d782A",
                                        deb0xViewsAddress: "0x5f8cABEa25AdA7DB13e590c34Ae4A1B1191ab997",
                                        deb0xERC20Address: "0x24b8cd32f93aC877D4Cc6da2369d73a6aC47Cb7b",
                                        xenCryptoAddress: "0x948eed4490833D526688fD1E5Ba0b9B35CD2c32e",
                                        chainId: parseInt(result, 16),
                                        chainName: "Dogechain",
                                        currency: "DOGE",
                                        priceURL: "https://dogechain-mainnet.gateway.pokt.network/v1/lb/b1ad9a15615e95af1a87f86d"
                                        })
                                        break;
                            case 10001:
                                    setChain({
                                        deb0xAddress: "0xAEC85ff2A37Ac2E0F277667bFc1Ce1ffFa6d782A",
                                        deb0xViewsAddress: "0x5f8cabea25ada7db13e590c34ae4a1b1191ab997",
                                        deb0xERC20Address: "0x24b8cd32f93aC877D4Cc6da2369d73a6aC47Cb7b",
                                        xenCryptoAddress: "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e",
                                        chainId: parseInt(result, 16),
                                        chainName: "EthereumPoW",
                                        currency: "ETHW",
                                        priceURL: "https://mainnet.ethereumpow.org"
                                        })
                                        break;
                }
            });
        } catch (err: any) {
            setError(err.message);
        }
    };
    
    const [error, setError] = useState<any>();

    const handleNetworkSwitch = async (networkName: any) => {
        setError("");
        await changeNetwork({ networkName, setError }).then(() => {
            window.location.reload();
        });
    };

    const networkChanged = (chainId: any) => {
       window.location.reload()
    };

    const handleClick = (event: any) => {
        const { currentTarget } = event;
        setAnchorEl(currentTarget)
        setOpen(!open)
    };

    const handleClickAway = () => {
        setOpen(false)
    };


    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div>
                <button onClick={handleClick} className="chain-switcher">
                    {chain.chainName.charAt(0).toUpperCase() + chain.chainName.slice(1)}
                </button>
                <Popper id={id} open={open} anchorEl={anchorEl} className="chain-popper">
                    <button
                        onClick={() => handleNetworkSwitch("polygon")}
                        className="btn"
                    >
                        <img alt="polygon" src={polygon} className="polygon"/>
                        Switch to Polygon
                    </button>
                    <button
                        onClick={() => handleNetworkSwitch("avalanche")}
                        className="btn"
                    >
                        <img alt="avalanche" src={avalanche} className="avalanche"/>
                        Switch to Avalanche
                    </button>
                    <button
                        onClick={() => handleNetworkSwitch("binance")}
                        className="btn"
                    >
                        <img alt="bnb" src={bnb} className="bnb"/>
                        Switch to Binance
                    </button>
                    <button
                        onClick={() => handleNetworkSwitch("fantom")}
                        className="btn"
                    >
                        <img alt="fantom" src={fantom} className="fantom"/>
                        Switch to Fantom
                    </button>
                    <button
                        onClick={() => handleNetworkSwitch("moonbeam")}
                        className="btn"
                    >
                        <img alt="moonbeam" src={moonbeam} className="moonbeam"/>
                        Switch to Moonbeam
                    </button>
                    <button
                        onClick={() => handleNetworkSwitch("okx")}
                        className="btn"
                    >
                        <img alt="okx" src={okx} className="okx"/>
                        Switch to OKXChain
                    </button>
                    <button
                        onClick={() => handleNetworkSwitch("evmos")}
                        className="btn"
                    >
                        <img alt="evmos" src={evmos} className="evmos"/>
                        Switch to Evmos
                    </button>
                    <button
                        onClick={() => handleNetworkSwitch("doge")}
                        className="btn"
                    >
                        <img alt="dc" src={dc} className="dc"/>
                        Switch to Dogechain
                    </button>
                    <button
                        onClick={() => handleNetworkSwitch("ethpow")}
                        className="btn"
                    >
                        <img alt="ethpow" src={ethpow} className="ethpow"/>
                        Switch to EthereumPoW
                    </button>
                </Popper>
            </div>
        </ClickAwayListener>
    )
}