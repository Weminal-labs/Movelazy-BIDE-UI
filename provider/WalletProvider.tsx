import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { PropsWithChildren } from "react";
import { AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const WalletProvider = ({ children }: PropsWithChildren) => {
    const wallets = [
        new PetraWallet()
    ];
    const config = new AptosConfig({
        network: Network.TESTNET,
        fullnode: 'https://aptos.testnet.porto.movementlabs.xyz/v1',
        faucet: 'https://fund.testnet.porto.movementlabs.xyz/'
    })

    return (
        <AptosWalletAdapterProvider
            plugins={wallets}
            autoConnect={true}
            dappConfig={config}
            onError={(error: Error) => {
                console.log("Wallet provider error", error);
            }}
        >
            {children}
        </AptosWalletAdapterProvider>
    );
};