import "next-auth"
import { DefaultSession } from "next-auth";

// https://next-auth.js.org/getting-started/typescript#extend-default-interface-properties

declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean
        isAcceptingMessages?: boolean
        username?: string
    }
    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
        } & DefaultSession["user"]
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}

// in nextjs types folder is a special folder and this is a file where we adding some datatypes in next-auth, we adding this because these all we need in token check options.ts file in auth folder, jwt() fucntion