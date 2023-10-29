import React from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { redirect } from "next/navigation";

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {

    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        redirect('/login')
    }

    return children
}