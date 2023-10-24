import { SupabaseAdapter } from "@auth/supabase-adapter";
import NextAuth from "next-auth/next";
import EmailProvider from "next-auth/providers/email";

// testando o next-auth com o supabase

// emoji usando oculos escuros no commit: :dark_sunglasses:
export default NextAuth({

    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
        }),
    ],
    adapter: SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
    })
});