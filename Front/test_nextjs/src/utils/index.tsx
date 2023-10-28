import { Session } from "@auth0/nextjs-auth0";
import { useSession } from "next-auth/react";

export interface User {
    id: string;
    name: string;
    email: string;
}

export const useUser = async (): Promise<User> => {
    const user: User = await fetch('http://localhost:3000/Usuario/sla1',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json());

    return user;
}