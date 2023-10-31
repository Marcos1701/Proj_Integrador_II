import { useEffect, useState } from "react";
import { useAuth } from "../../../Contexts/AuthContext";
import './Menu.css'


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
                    <a href="#" onClick={() => setIsMenuOpen(!isMenuOpen)} className="anchor-menu">
                        <img src="\assets\Menu\Menu_icon.svg" alt="Menu" className="menu-icon" />
                    </a>
                </div>
            ) : (
                <div className="menu-actived">
                    <a href="#" onClick={() => setIsMenuOpen(!isMenuOpen)} className="anchor-menu">
                        <img src="\assets\Menu\Menu_icon.svg" alt="Menu" className="menu-icon" />
                    </a>
                    <button onClick={() => { }}>Perfil</button>
                    <button onClick={() => { }}>Configurações</button>
                    <button className="singnout-button" onClick={() => signout()}>Sair</button>
                </div>
            )
            }
        </div>
    )
}