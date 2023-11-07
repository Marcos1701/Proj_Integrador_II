import { Navigate } from "react-router-dom";
import { useAuth } from "../../../Contexts/AuthContext";
import { FormCadastro } from "./Components/FormCadastro";
import './styles.css'


export function RegisterPage() {

    const { user } = useAuth()

    if (user) {
        return <Navigate to="/" />
    }

    return (
        <>
            <FormCadastro />
        </>
    )
}