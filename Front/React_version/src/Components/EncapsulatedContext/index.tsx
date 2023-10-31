import { useAuth } from "../../Contexts/AuthContext";

export const useUser = ()=> {
    const {user} = useAuth();

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

    return user;
}