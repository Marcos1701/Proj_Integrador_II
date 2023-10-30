import { options } from "@/pages/api/auth/[...nextauth]/route";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export const useUser = async (): Promise<User> => {
    const session = await getServerSession(options);
    if (!session) {
        redirect('/login')
    }
    const { user } = session;
    return user;
}