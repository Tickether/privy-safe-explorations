"use client"


import { PrivyProvider } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { base } from "viem/chains"


type Props = {
    children: ReactNode,
}

export function PrivyContext ({ children }: Props) {

    const router = useRouter()

    return (
        <>
            <PrivyProvider
                appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
                config={{
                    supportedChains: [base],
                    defaultChain: base, 
                    /* Replace this with your desired login methods */
                    loginMethods: [ "email" ],
                    /* Replace this with your desired appearance configuration */
                    appearance: {
                        theme: "dark",
                        accentColor: "#0C3FFF",
                        logo: "",
                        showWalletLoginFirst: true,
                    },
                    embeddedWallets: {
                        createOnLogin: 'users-without-wallets', 
                    }
                }}
            >
                {children}
            </PrivyProvider>
        </>
    )
}
