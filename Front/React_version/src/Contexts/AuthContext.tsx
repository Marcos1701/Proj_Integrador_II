// import axios from "axios";
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

export const api_url: string = "http://localhost:3300/"
//"https://legendary-space-spoon-gvjqgjx7gx92vv5g-3300.app.github.dev/"

// AuthProvider encapsula o AuthContextProvider e o AuthContext
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(
        localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!
        ) : null
    )


    const signin = async (data: singinData): Promise<string | void> => {

        const response = await fetch(`${api_url}Usuario?email=${data.email}&Senha=${data.password}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json()
        ).then(res => {
            if (res.length === 0) {
                return { error: { status: 404, message: 'Usuário não encontrado' } }
            }

            const user = res[0]

            const userToSave: User
                = {
                id: user.id,
                nome: user.nome,
                email: user.email,
                Senha: user.Senha,
                lembrar: data.lembrar
            }
            setUser(userToSave)
            data.lembrar && localStorage.setItem('user', JSON.stringify(userToSave))
        }).catch(err => {
            console.log(err)
            return { error: { status: 500, message: 'Erro no servidor' } }
        })

        if (response && response.error.message) {
            return response.error.message
        }
    }

    const singup = async (user: User): Promise<string | void> => {

        const { error }: { error?: ErrorAuth } = await fetch(`${api_url}Usuario`, {
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


/* Uncaught (in promise) Error: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.
    at Object.throwInvalidHookError (react-dom.development.js:16227:9)
    at useContext (react.development.js:1618:21)
    at useAuth (AuthContext.tsx:132:25)
    at useUser (index.tsx:4:20)
    at getUser (index.tsx:19:32)
    at index.tsx:31:9
    at commitHookEffectListMount (react-dom.development.js:23150:26)
    at commitPassiveMountOnFiber (react-dom.development.js:24926:13)
    at commitPassiveMountEffects_complete (react-dom.development.js:24891:9)
    at commitPassiveMountEffects_begin (react-dom.development.js:24878:7) 
    
    este erro ocorre quando se tenta usar um hook fora de um componente funcional, ou seja, fora de uma função que retorna um JSX
    para resolver, basta colocar o hook dentro de uma função que retorna um JSX
    */