import { getServerSideProps } from "next/dist/build/templates/pages";
import React, { createContext, useContext, useMemo, useState } from "react";
import { ulid } from 'ulidx';

export type User = {
    id: string;
    username: string;
    email: string;
    password: string;
    lembrar: boolean
}

type singinData = {
    email: string;
    password: string;
    lembrar: boolean;
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
        ) : {
            id: ulid(),
            username: 'Marcos Neiva',
            email: 'marcosneiva123@tester.123',
            password: '12345',
            lembrar: true
        }
    )

    const signin = async (data: singinData): Promise<string | void> => {
        const { error, user }: { error?: ErrorAuth, user: User }
            = await fetch(`http://localhost:3000/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password
                })
            }).then(res => res.json()
            ).catch(err => {
                console.log(err)
                return { error: { status: 500, message: 'Erro no servidor' } }
            })

        if (error) {
            return error.message
        }

        if (data.lembrar) {
            localStorage.setItem("email", user.email)
            localStorage.setItem("password", user.password)
        }
        setUser(user);
    }

    const singup = async (user: User): Promise<string | void> => {

        const { error }: { error?: ErrorAuth } = await fetch(`http://localhost:3000/auth/register`, {
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
            localStorage.setItem("email", user.email)
            localStorage.setItem("password", user.password)
        }
        setUser(user);
    }

    const signout = (): void => {
        if (!user?.lembrar) {
            localStorage.removeItem("email")
            localStorage.removeItem("password")
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