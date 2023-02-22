import { useContext, useEffect, useState } from "react";
import ChainContext from "./ChainContext";

const networks: any = {
    polygon: {
      chainId: `0x${Number(137).toString(16)}`,
      chainName: "Polygon Mainnet",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18
      },
      rpcUrls: ["https://polygon-rpc.com/"],
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
    }
};

export default function ChainSetter(props: any) {
    const { chain, setChain } = useContext(ChainContext);


    useEffect(() => {
        window.ethereum.on("chainChanged", networkChanged);

        console.log("CHAIN", chain)

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
                if(parseInt(result, 16) === 137) {
                    setChain({
                        deb0xAddress: "0x4F3ce26D9749C0f36012C9AbB41BF9938476c462",
                        deb0xViewsAddress: "0xCF7582E5FaC8a6674CcD96ce71D807808Ca8ba6E",
                        deb0xERC20Address: "0x47DD60FA40A050c0677dE19921Eb4cc512947729",
                        xenCryptoAddress: "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e",
                        chainId: parseInt(result, 16)
                    })
                } else {
                    setChain({
                        deb0xAddress: "0xAEC85ff2A37Ac2E0F277667bFc1Ce1ffFa6d782A",
                        deb0xViewsAddress: "0x5f8cABEa25AdA7DB13e590c34Ae4A1B1191ab997",
                        deb0xERC20Address: "0x24b8cd32f93aC877D4Cc6da2369d73a6aC47Cb7b",
                        xenCryptoAddress: "0xC0C5AA69Dbe4d6DDdfBc89c0957686ec60F24389",
                        chainId: parseInt(result, 16)
                    })
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
        console.log({ chainId });
    };

    return (
        <div className="row">
            <button
                onClick={() => handleNetworkSwitch("polygon")}
                className="mt-2 mb-2 btn btn-primary"
            >
                Switch to Polygon
            </button>
            <button
                onClick={() => handleNetworkSwitch("avalanche")}
                className="mt-2 mb-2 btn bg-warning"
            >
                Switch to Avalanche
            </button>
        </div>
    )
}