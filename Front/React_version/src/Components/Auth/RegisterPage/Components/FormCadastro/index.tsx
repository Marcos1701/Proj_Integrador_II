import { useRef, useState } from "react"
import { singupData, useAuth } from '../../../../../Contexts/AuthContext';
import { Link, Navigate } from "react-router-dom";
import "./FormCadastro.css"
import { FiEye, FiEyeOff } from "react-icons/fi";

export function FormCadastro() {

    const { singup } = useAuth()

    const [isAltenticado, setIsAutenticado] = useState<boolean>(false)

    const nome = useRef<HTMLInputElement>(null)
    const email = useRef<HTMLInputElement>(null)
    const senha = useRef<HTMLInputElement>(null)
    const lembrar = useRef<HTMLInputElement>(null)

    const [isEditingNome, setIsEditingNome] = useState<boolean>(false)
    const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false)
    const [isEditingSenha, setIsEditingSenha] = useState<boolean>(false)
    const [request, setRequest] = useState<boolean>(false)

    const [isError, setIsError] = useState(false)
    const [msgError, setMsgError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (request) return;
        if (!nome.current || !email.current || !senha.current || !lembrar.current) return console.log('erro');

        if (!nome.current.value || !email.current.value || !senha.current.value) {
            setIsError(true)
            setMsgError('Preencha todos os campos')
            return
        }

        if (senha.current.value.length < 4) {
            setIsError(true)
            setMsgError('A senha deve ter no minimo 4 caracteres!!')
            return
        }

        if (senha.current.value.length > 100) {
            setIsError(true)
            setMsgError('A senha deve ter no maximo 100 caracteres!!')
            return
        }

        if (nome.current.value.length < 4) {
            setIsError(true)
            setMsgError('O nome deve ter no minimo 4 caracteres!!')
            return
        }

        if (!email.current.value.includes('@')) {
            setIsError(true)
            setMsgError('Email invalido!!')
            return
        }

        if (nome.current.value.length > 100) {
            setIsError(true)
            setMsgError('O nome deve ter no maximo 100 caracteres')
            return
        }

        setIsError(false);

        const dados: singupData = {
            nome: nome.current.value,
            email: email.current.value,
            senha: senha.current.value,
            lembrar: lembrar.current.checked
        }

        setRequest(true)
        const error = await singup(dados)

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
        <form onSubmit={handleSubmit} className='form-auth'>
            <div className="title-auth-div">
                <h2 className='title-auth'>Sign up</h2>
                <div className="line-auth">
                    <p>Se você já tem uma conta</p>
                    <span className="link-auth-span"> Você pode <Link to={'/login'} className='link-auth'>Logar aqui!!</Link></span>
                </div>
            </div>
            {isAltenticado && <Navigate to="/" />}
            {isError && <p className='error-msg'>{msgError}</p>}

            <div className="propiety-auth-div">
                <label className='label-nome' htmlFor='input-userName' >Nome</label>
                <input type="text" placeholder="Digite seu nome" className='input-userName' name="input-userName" ref={nome} onFocus={() => setIsEditingNome(true)} onBlur={() => setIsEditingNome(false)} />
                <div className={
                    isEditingNome
                        ? 'line-editing'
                        : 'line'
                }></div>
            </div>

            <div className="propiety-auth-div">
                <label className='label-email' htmlFor='input-email' >Email</label>
                <input type="email" placeholder="Email" className='email-input' ref={email} onFocus={() => setIsEditingEmail(true)} onBlur={() => setIsEditingEmail(false)} />
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
                    <input type="checkbox" className='checkbox-lembrar' id='checkbox-lembrar' ref={lembrar} title="Lembrar-me" />
                    <label className='label-lembrar' htmlFor='checkbox-lembrar'  >Lembrar-me</label>
                </div>
            </div>


            <button type='submit' className='btn-auth'>Registrar</button>
        </form >
    )

    // quando o usuario clica em lembrar, o email e senha ficam salvos no localstorage
}