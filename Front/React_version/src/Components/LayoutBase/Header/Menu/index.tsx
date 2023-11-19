import { useEffect, useState } from "react";
import { useAuth } from "../../../../Contexts/AuthContext";
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
    }, [isMenuOpen]);

    return (
        <div className="menu">
            {!isMenuOpen ? ( // onclick="this.classList.toggle('opened');this.setAttribute('aria-expanded', this.classList.contains('opened'))" aria-label="Main Menu"
                <div className="menu-div">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="menu" aria-label="Main Menu">
                        <svg width="30" height="30" viewBox="0 0 100 100">
                            <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                            <path className="line line2" d="M 20,50 H 80" />
                            <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="menu-actived" onMouseLeave={() => setIsMenuOpen(!isMenuOpen)}>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="opened">
                        <svg width="30" height="30" viewBox="0 0 100 100">
                            <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                            <path className="line line2" d="M 20,50 H 80" />
                            <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                        </svg>
                    </button>
                    <button onClick={() => { }}>Perfil</button>
                    <button onClick={() => { }}>Configurações</button>
                    <button className="singnout-button" onClick={() => signout()}>Sair</button>
                </div>
            )
            }
        </div>
    )
}