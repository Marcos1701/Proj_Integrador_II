import axios from "axios";
import React, { createContext, useContext, useMemo, useState } from "react";
// import { ulid } from 'ulidx';

export type User = {
    id: string;
    nome: string;
    email: string;
    Senha: string;
    lembrar?: boolean
}

type singinData = {
    email: string;
    password: string;
    lembrar?: boolean;
}

type ErrorAuth = {
    status: number;
    message: string;
}


interface AuthContextType {
    user: User | null
    signin: (data: singinData) => Promise<string | void>
    singup: (user: User) => Promise<string | void>
    signout: () => void
    isAuthenticated: boolean
}

const defaultValue = {} as AuthContextType

const AuthContext = createContext<AuthContextType>(defaultValue)

interface AuthProviderProps {
    children: React.ReactNode
}

// AuthProvider encapsula o AuthContextProvider e o AuthContext
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(
        localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!
        ) : null
    )

    /*
    index.tsx:34  Uncaught (in promise) TypeError: signin is not a function
    at handleSubmit (index.tsx:34:29)
    at HTMLUnknownElement.callCallback2 (react-dom.development.js:4164:14)
    at Object.invokeGuardedCallbackDev (react-dom.development.js:4213:16)
    at invokeGuardedCallback (react-dom.development.js:4277:31)
    at invokeGuardedCallbackAndCatchFirstError (react-dom.development.js:4291:25)
    at executeDispatch (react-dom.development.js:9041:3)
    at processDispatchQueueItemsInOrder (react-dom.development.js:9073:7)
    at processDispatchQueue (react-dom.development.js:9086:5)
    at dispatchEventsForPlugins (react-dom.development.js:9097:3)
    at react-dom.development.js:9288:12
    
    // o erro acima ocorre, pois o método signin não está definido
    // para resolver esse problema, basta definir o método signin
    // definindo o método signin, o erro acima é resolvido
    // da seguinte forma:
    */

    const signin = async (data: singinData): Promise<string | void> => {

        const response = await fetch(`http://localhost:3300/Usuario?email=${data.email}&Senha=${data.password}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json()
        ).then(res => {
            if (res.length === 0) {
                return { error: { status: 404, message: 'Usuário não encontrado' } }
            }
            setUser(res[0])
        }).catch(err => {
            console.log(err)
            return { error: { status: 500, message: 'Erro no servidor' } }
        })

        if (response && response.error.message) {
            return response.error.message
        }

        if (data.lembrar) {
            localStorage.setItem('user', JSON.stringify(user))
        }
    }

    const singup = async (user: User): Promise<string | void> => {

        const { error }: { error?: ErrorAuth } = await fetch(`http://localhost:3300/Usuario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(res => res.json()
        ).catch(err => {
            console.log(err)
            return { error: { status: 500, message: 'Erro no servidor' } }
        })

        if (error) {
            return error.message
        }

        if (user.lembrar) {
            localStorage.setItem('user', JSON.stringify(user))
        }
        setUser(user);
    }

    const signout = (): void => {
        if (!user?.lembrar) {
            localStorage.setItem('user', JSON.stringify(user))
        }

        setUser(null);
        localStorage.removeItem('user');
    }

    const value = useMemo(() => ({
        user, signin, singup, signout, isAuthenticated: user != null
    }), [user])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const authContext = useContext(AuthContext)

    if (!authContext)
        throw new Error('useAuth fora do AuthProvider!')

    return authContext
}