"use client"
import { purchase } from "@/utils/purchase";
import { motion } from "framer-motion";
import { useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useSafe } from "@/providers/SafeContext";
import { Button } from "./ui/button";
import { base } from "viem/chains";

export function MemberNotFound() {
    const { smartAccountClient, smartAccountAddress } = useSafe()
    const [ loading, setLoading ] = useState<boolean>(false)
    console.log(smartAccountAddress!)
    const enterPortal = async() => {
        try {
            setLoading(true)
            
            //....
            console.log(smartAccountAddress!)
            const purchase_ = purchase(smartAccountAddress!) 
            console.log(purchase_)
            
            const txHash = await smartAccountClient.sendTransaction({
                account: smartAccountClient.account!,
                chain: base,
                to: "0x7e0cc161Cd22876004010b1DA831c855e75EbeB4",
                data: purchase_,
                value: BigInt(0)
            })
            console.log(txHash)
            
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)  
        }
    }
    return (
        <div className="flex flex-col justify-center w-full gap-5">
            <p>You do not have a Portal Key, click below to get Internet Access for 24hrs</p>
            <div className="flex w-full justify-center">
                <Button className="w-36" onClick={enterPortal} disabled={loading}>
                    {
                        loading
                        ? (
                            <>
                                <motion.div
                                initial={{ rotate: 0 }} // Initial rotation value (0 degrees)
                                animate={{ rotate: 360 }} // Final rotation value (360 degrees)
                                transition={{
                                    duration: 1, // Animation duration in seconds
                                    repeat: Infinity, // Infinity will make it rotate indefinitely
                                    ease: "linear", // Animation easing function (linear makes it constant speed)
                                }}
                            >
                                    <DotsHorizontalIcon/>
                                </motion.div>
                            </>
                        )
                        : (
                            <>
                                Enter Portal
                            </>
                        )
                    }
                </Button>
            </div>
        </div>
    );
}