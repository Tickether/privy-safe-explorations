import { encodeFunctionData } from "viem"
import { PublicLockV14 } from "@unlock-protocol/contracts"


export const purchase = (reciever: `0x${string}`) => {
    const purchaseData = encodeFunctionData({
        abi: PublicLockV14.abi,
        functionName: "purchase",
        args: [([BigInt(0)]), ([reciever]), (["0x99342D3CE2d10C34b7d20D960EA75bd742aec468"]), (["0x99342D3CE2d10C34b7d20D960EA75bd742aec468"]), (["0x"])]
    })

    
    return purchaseData
}