import { NavLink } from "react-router-dom"
import { useAuth } from "../../Contexts/AuthContext"
import { Menu } from "./Menu"
import './Header.css'

export function Header() {

    const { user } = useAuth()
    return (
        <header>
            {user ? (
                <p>Olá, {user.nome}</p>
            ) : (
                <p>Olá, visitante</p>
            )}
            <nav>
                <ul>
                    {user ? (
                        <>
                            <li>
                                <NavLink to="/">Home</NavLink>
                            </li>
                            <li>
                                <NavLink to={"/Transacoes"}>Transações</NavLink>
                            </li>
                            <li>
                                <Menu />
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <NavLink to="/login">Login</NavLink>
                            </li>
                            <li>
                                <NavLink to="/register">Cadastro</NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    )
}