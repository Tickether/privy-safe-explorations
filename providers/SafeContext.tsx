import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { createSmartAccountClient, ENTRYPOINT_ADDRESS_V07, SmartAccountClient, walletClientToSmartAccountSigner } from "permissionless";
import { signerToSafeSmartAccount, SmartAccount } from "permissionless/accounts";
import { erc7579Actions } from "permissionless/actions/erc7579";
import { pimlicoPaymasterActions } from "permissionless/actions/pimlico";
import { createPimlicoBundlerClient, createPimlicoPaymasterClient } from "permissionless/clients/pimlico";
import { EntryPoint, ENTRYPOINT_ADDRESS_V07_TYPE } from "permissionless/types";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { Chain, createPublicClient, createWalletClient, custom, http, Transport } from "viem";
import { base } from "viem/chains";

type SafeContextProps = {
    children: ReactNode,
}

interface SafeSmartAccountInterface {
    smartAccountClient?: SmartAccountClient<EntryPoint, Transport, Chain, SmartAccount<EntryPoint, string, Transport, Chain>> | Transport | SmartAccount<EntryPoint, string, Transport, Chain> | any | null
    smartAccountAddress?: `0x${string}`;
};

const Safe = React.createContext<SafeSmartAccountInterface>({
    smartAccountClient: undefined,
    smartAccountAddress: undefined
});

export function useSafe () {
    return useContext(Safe);
};

export function SafeContext ({ children }: SafeContextProps) {
    const [embeddedWallet, setEmbeddedWallet] = useState<ConnectedWallet | undefined>()
    const [smartAccountClient, setSmartAccountClient] = useState<SmartAccountClient<EntryPoint, Transport, Chain, SmartAccount<EntryPoint, string, Transport, Chain>> | Transport | SmartAccount<EntryPoint, string, Transport, Chain> | any | null>()
    const [smartAccountAddress, setSmartAccountAddress] = useState<`0x${string}` | undefined>()
    const [smartAccountReady, setSmartAccountReady] = useState<boolean>(false);

    const {wallets} = useWallets();
    const {user, ready, authenticated} = usePrivy();



    // make sure connected walltet == privy user before setting embed
    useEffect(() => {
        const connectedWallet = wallets[0]
        const connectedUserWallet = user?.wallet
        if (connectedWallet?.walletClientType === connectedUserWallet?.walletClientType) {
            setEmbeddedWallet(connectedWallet)
        }
    }, [ wallets, user ]);
    const publicClient = createPublicClient({
        chain: base, // Replace this with the chain of your app
        transport: http(),
    });
    const pimlicoBundlerClient = createPimlicoBundlerClient({
        transport: http(`https://api.pimlico.io/v2/8453/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_APP_ID}`),
        entryPoint: ENTRYPOINT_ADDRESS_V07,
    });
    const biconomyPaymasterClient = createPimlicoPaymasterClient({
        transport: http(
            process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_URL,
        ),
        entryPoint: ENTRYPOINT_ADDRESS_V07
    });

    
    const getWalletClientCreateSmartAccount = async () => {
        
        // Get an EIP1193 provider from the user"s wallet
        const eip1193provider = await embeddedWallet!.getEthereumProvider();
        
        // Create a Viem wallet client from the EIP1193 provider
        const privyClient = createWalletClient({
            account: embeddedWallet!.address as `0x${string}`,
            chain: base, // Replace this with the chain used by your application
            transport: custom(eip1193provider)
        });
        const customSigner = walletClientToSmartAccountSigner(privyClient);
        const safeAccount = await signerToSafeSmartAccount(
            publicClient,
            {
                signer: customSigner,
                safeVersion: '1.4.1',
                entryPoint: ENTRYPOINT_ADDRESS_V07,
                safe4337ModuleAddress: "0x3Fdb5BC686e861480ef99A6E3FaAe03c0b9F32e2", // These are not meant to be used in production as of now.
	            erc7579LaunchpadAddress: "0xEBe001b3D534B9B6E2500FB78E67a1A137f561CE", // These are not meant to be used in production as of now.
            }
        );
        const smartAccountClient = createSmartAccountClient({
            account: safeAccount,
            entryPoint: ENTRYPOINT_ADDRESS_V07,
            chain: base,
            bundlerTransport: http(`https://api.pimlico.io/v2/8453/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_APP_ID}`),
            middleware: {
                gasPrice: async () => {
                    return (await pimlicoBundlerClient.getUserOperationGasPrice()).fast
                },
                sponsorUserOperation: biconomyPaymasterClient.sponsorUserOperation,
            },
        }).extend(erc7579Actions({ entryPoint: ENTRYPOINT_ADDRESS_V07 }))

        //const smartAccountAddress = smartAccountClient.account?.address;

        setSmartAccountClient(smartAccountClient);
        setSmartAccountAddress(smartAccountClient.account?.address);
        setSmartAccountReady(true);
    }

    const readyOrNot = async () => {
        //logout smart account 
        /*       
        if (ready && !authenticated){
            setSmartAccountAddress(undefined);
            setSmartAccountClient(undefined);   
            setEmbeddedWallet(undefined)
        }
        */
        
        //not ready or not logged in
        if (!ready || !authenticated) return;

        //find privy signer & create/login smart account
        if (!embeddedWallet) return; 
        if (embeddedWallet && !smartAccountClient) getWalletClientCreateSmartAccount();

        
    }
    useEffect(() => {
        readyOrNot()
    }, [wallets, ready, authenticated, embeddedWallet]);

    return (
        <>
            <Safe.Provider value={{smartAccountClient: smartAccountClient, smartAccountAddress: smartAccountAddress}}>{children}</Safe.Provider>
        </>
    )
    
}