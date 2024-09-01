"use client";

import { useRouter } from "next/navigation";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useLogin } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";



export function Login() {
    const router = useRouter()
    
    const { authenticated } = usePrivy();
    
    const {login} = useLogin ({
        onComplete: ( wasAlreadyAuthenticated,  ) => {
            
            
            if (!wasAlreadyAuthenticated) {
                router.replace("/explore")
                
            }
            
        }
    });
    

    const Login = async () => {
        try {
            if (authenticated) {
                router.push("/explore")
            }
            if (!authenticated) {
                login()
            }
        } catch (error) {
            console.log(error)
        }
    }

    
    return (
        <Button onClick={Login} className="">
            <div className="flex w-full items-center">
              <p>login</p>
              <ArrowRightIcon/>
            </div>
        </Button>
    );
}