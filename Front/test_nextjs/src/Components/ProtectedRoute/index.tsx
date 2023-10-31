import React from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { options } from "@/pages/api/auth/[...nextauth]";
import { useUser } from "@/EncapsulatedContext";

interface ProtectedRouteProps {
    children: React.ReactNode
}

export async function ProtectedRoute({ children }: ProtectedRouteProps) {
    const user = await useUser();
    console.log(user)
    if (!user) {
        redirect('/login')
    }
    return <>{children}</>
}