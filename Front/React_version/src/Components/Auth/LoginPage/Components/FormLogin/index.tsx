import { useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { singinData, useAuth } from "../../../../../Contexts/AuthContext";
import './styles.css'
import { FiEye, FiEyeOff } from "react-icons/fi";

export function FormLogin() {

    const { signin } = useAuth()
    const [isAltenticado, setIsAutenticado] = useState<boolean>(false)
    const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false)
    const [isEditingSenha, setIsEditingSenha] = useState<boolean>(false)
    const [request, setRequest] = useState<boolean>(false)

    const email = useRef<HTMLInputElement>(null)
    const senha = useRef<HTMLInputElement>(null)
    const lembrar = useRef<HTMLInputElement>(null)

    const [isError, setIsError] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>('')


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (request) return;
        if (!email.current?.value || !senha.current?.value || !lembrar.current) {
            setIsError(true)
            setMsgError('Preencha todos os campos')
            return
        }

        const dados: singinData = {
            email: email.current.value,
            senha: senha.current.value,
            lembrar: lembrar.current.checked
        }

        setRequest(true)

        const error = await signin(dados)

        if (error) {
            setIsError(true)
            setMsgError(error)
            setRequest(false)
            return
        }

        setIsAutenticado(true)
        setRequest(false)
    }

    const [showPassword, setShowPassword] = useState(false)

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }


    return (
        <form onSubmit={handleSubmit} className='form-auth' >
            <div className="title-auth-div">
                <h2 className='title-auth'>Sign in</h2>
                <div className="line-auth">
                    <p>Se você não tem uma conta registre-se</p>
                    <span className="link-auth-span"> Você pode <Link to={'/signup'} className='link-auth'>Registrar-se aqui!</Link></span>
                </div>
            </div>
            {isAltenticado && <Navigate to="/" />}
            {isError && <p className='error-msg'>{msgError}</p>}
            <div className="propiety-auth-div">
                <label className='label-email' htmlFor='input-email'>Email</label>
                <input type="email" placeholder="Entre com o seu endereço de email" className='email-input' ref={email} onFocus={() => setIsEditingEmail(true)} onBlur={() => setIsEditingEmail(false)} />
                <div className={
                    isEditingEmail
                        ? 'line-editing'
                        : 'line'
                }></div>
            </div>

            <div className="propiety-auth-div">
                <div className="input-password-container">
                    <label htmlFor="input-senha">Senha</label>
                    <div className="InputPassword" >
                        <input
                            type={showPassword ? "text" : "password"}
                            id="input-senha"
                            name="input-senha"
                            className="password-input"
                            ref={senha}
                            placeholder="Entre com a sua senha"
                            onFocus={() => setIsEditingSenha(true)}
                            onBlur={() => setIsEditingSenha(false)}
                        />
                        <button type="button" onClick={handleShowPassword} className="show-password-button"
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </div>
                <div className={
                    isEditingSenha
                        ? 'line-editing'
                        : 'line'
                }></div>
                <div className="Lembrar-auth-div">
                    <input type='checkbox' className='checkbox-lembrar' ref={lembrar} title="Lembrar-me" id="checkbox-lembrar" />
                    <label className='label-lembrar' htmlFor='checkbox-lembrar'  >Lembrar-me</label>
                </div>
            </div>


            <button type='submit' className='btn-auth'>Login</button>
        </form >

    )
}