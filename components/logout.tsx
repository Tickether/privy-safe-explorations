"use client"

import { ExitIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import {useLogout} from "@privy-io/react-auth";




export function Logout () {
    const router = useRouter()
    
    const {logout} = useLogout({
        onSuccess: () => {
            console.log('User logged out');
            // Any logic you'd like to execute after a user successfully logs out
            router.push("/")
        },
    });

    
    return(
        <Button className="gap-2" variant="outline"
            onClick={async ()=>{
                await logout()
            }}
        >
            <ExitIcon/>
            <span className="max-md:hidden">Wxit</span>
        </Button>

    )
}