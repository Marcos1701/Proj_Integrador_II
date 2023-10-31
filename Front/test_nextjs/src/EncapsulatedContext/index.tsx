import { options } from "@/pages/api/auth/[...nextauth]";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";


export const useUser = async (): Promise<User> => {
    const defaulUser: User = {
        id: "sla",
        name: 'Usuário Padrão',
        email: 'teste@teste.com'
    }

    // signIn('credentials', {
    //     redirect: true,
    //     ...defaulUser
    // });

    // const Session = await getServerSession(options);

    // o session esta vindo null, mesmo o usuário estando logado
    // para resolver isso, é necessário passar o session para o getServerSession

    // if (!session) {
    //     redirect('/login')
    // }

    return defaulUser;
}