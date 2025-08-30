import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

// * IMP: we used this ----> https://next-auth.js.org/configuration/providers/credentials
                            // https://next-auth.js.org/configuration/callbacks 
// https://next-auth.js.org/configuration/providers/oauth
// https://next-auth.js.org/configuration/providers/email
// next-auth k liye sirf ye 2 files banegi options and route, options file me next-auth ka pura setup, providers sab hote hai

// different providers hote hai like githubProvider, googleProvider, credentialProvider, etc. we used here credentialProvider because it is little tough compare to other providers.
// credentialProvider we used email and password

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: { // isse behind the scence html form banega
                email: { label: "Email", type: "text" },
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials: any): Promise<any> { // credential hamare hai toh authorize statergy bhi hamari hi hogi, agar different provider hota like google, github etc toh next-auth hi kar deta
                await dbConnect()
                console.log("credentials: ", credentials);
                console.log("credentials.identifier: ", credentials.identifier);
                
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier }, // email milega credentials.indentifier se
                            {username: credentials.identifier}
                        ]
                    })

                    if (!user) {
                        throw new Error("No user found with this email or username")
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.Password)

                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("Incorrect email or password")
                    }

                } catch (error: any) {
                    throw new Error(error)
                }
            },
        })
    ],
    callbacks: {
        async session({ session, token }) {
            session.user._id = token._id
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessages = token.isAcceptingMessages
            session.user.username = token.username

            return session
        }, // next-auth zayada tar session based pe chalta hai

        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }

            return token
        }
    },
    pages: {
        signIn: 'sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}