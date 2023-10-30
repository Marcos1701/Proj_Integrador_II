import { NextApiHandler } from "next";
import { NextAuthOptions, Session, User } from "next-auth";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials) {
                    return null;
                }

                const user: User = {
                    id: "sla",
                    name: "John Smith",
                    email: credentials.email
                }

                return user;
                // por enquanto, só retorna o que foi digitado, pois a api não está pronta
                // const Response = await fetch("http://localhost:3300/Usuario?email=" + credentials.email + "&senha=" + credentials.password);
                // const data = await Response.json();
                // if (data && Response.ok) {
                // return data;
                // }
                return null;
            }
        })
    ],
    pages: {
        signIn: "/"
    },
    callbacks: {
        async jwt({ token, user }) {
            user && (token.user = user);
            return token;
        },
        async session({ session, token }) {
            session = token.user as Session;
            return session;
        }
    }
}


const handler: NextApiHandler = NextAuth(options);

export { handler as GET, handler as POST }