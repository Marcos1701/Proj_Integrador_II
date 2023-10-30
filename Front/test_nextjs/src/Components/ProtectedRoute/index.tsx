import React from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { options } from "@/pages/api/auth/[...nextauth]/route";

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {

    const session = getServerSession(options);

    if (!session) {
        redirect('/login')
    }

    return children
}