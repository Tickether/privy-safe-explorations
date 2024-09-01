"use client";


import { useSafe } from "@/providers/SafeContext";
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { MemberNotFound } from "./notFound";


export default function Account() {
    const { user } = usePrivy()
    const { smartAccountAddress } = useSafe()
    console.log(user)
    const { wallets } = useWallets();
    console.log(wallets)
    console.log(smartAccountAddress!)
    

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>
                <p>{user?.wallet?.address}</p>
                <p>{smartAccountAddress}</p>
                <MemberNotFound/>
            </div>
        </main>
    );
}
