import { Navigate } from "react-router-dom";
import { useAuth } from "../../../Contexts/AuthContext";
import { FormLogin } from "./Components/FormLogin";
import './Loginpage.css'

export function LoginPage() {

    const { user } = useAuth()

    if (user) {
        return <Navigate to="/" />
    }

    return (
        <main>
            <FormLogin />
        </main>
    )
}