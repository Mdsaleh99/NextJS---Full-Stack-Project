"use client"
import { useSession, signIn, signOut } from "next-auth/react";

// https://next-auth.js.org/getting-started/example#add-api-route
export default function Component() {
    const { data: session } = useSession();
    if (session) {
        return (
            <>
                Signed in as {session.user.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        );
    }
    return (
        <>
            Not signed in <br />
            <button className="bg-orange-500 p-2 cursor-pointer rounded-2xl" onClick={() => signIn()}>Sign in</button>
        </>
    );
}
