import { Session } from "@auth0/nextjs-auth0";
import { useSession } from "next-auth/react";

export const useUser = () => {
    const { data: session } = useSession();
    const user: Session['user'] = session?.user!;

    return user;
}