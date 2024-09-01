import Account from "@/components/account";
import { Logout } from "@/components/logout";

export default function Explore() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Logout/>
            exploring...
            <Account/>
        </main>
    );
}
