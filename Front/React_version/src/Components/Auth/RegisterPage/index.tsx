import { Navigate } from "react-router-dom";
import { useAuth } from "../../../Contexts/AuthContext";
import { FormCadastro } from "./Components/FormCadastro";
import './styles.css'
import { HashLoader } from "react-spinners";


export function RegisterPage() {

    const { user, loading } = useAuth()

    if (user) {
        return <Navigate to="/" />
    }

    return (
        <main className="authPage">
            <div className="authPage__image"></div>
            <div className="logo_authPage">
                <img src="Icons/icone.png" alt="Logo" />
                <p>FinnApp</p>
            </div>
            {
                loading && <div className="loading">
                    <div className="loading__content">
                        <HashLoader color="#36d7b7"
                            size={45}
                            speedMultiplier={1.2}
                        />
                    </div>
                </div>
            }
            <FormCadastro />
        </main>
    )
}