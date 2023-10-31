import { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";


export function Menu() {

    const { signout } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    // para fechar o menu quando o usuário clicar fora do menu
    useEffect(() => {
        function closeMenu(e: MouseEvent) {
            if (isMenuOpen) {
                const target = e.target as HTMLElement
                if (!target.closest('.menu')) {
                    setIsMenuOpen(false)
                }
            }
        }
        document.addEventListener('click', closeMenu)
        return () => {
            document.removeEventListener('click', closeMenu)
        }
    }
        , [isMenuOpen]);
    return (
        <div className="menu">
            {!isMenuOpen ? (
                <div className="menu">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>...</button>
                </div>
            ) : (
                <div className="menu">
                    <button onClick={() => { }}>Perfil</button>
                    <button onClick={() => { }}>Configurações</button>
                    <button onClick={() => signout()}>Sair</button>
                </div>
            )
            }
        </div>
    )
}