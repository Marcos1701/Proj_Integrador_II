import { useRef, useState } from "react";
import { ulid } from "ulidx";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../../../Contexts/AuthContext";
import './styles.css'

export function FormLogin() {

    const { signin } = useAuth()
    const [isAltenticado, setIsAutenticado] = useState<boolean>(false)

    const email = useRef<HTMLInputElement>(null)
    const senha = useRef<HTMLInputElement>(null)
    const lembrar = useRef<HTMLInputElement>(null)

    const [isError, setIsError] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email.current?.value || !senha.current?.value || !lembrar.current) {
            setIsError(true)
            setMsgError('Preencha todos os campos')
            return
        }

        const dados = {
            id: ulid(),
            email: email.current.value,
            password: senha.current.value,
            lembrar: lembrar.current.checked
        }

        const error = await signin(dados)

        if (error) {
            setIsError(true)
            setMsgError(error)
            return
        }

        setIsAutenticado(true)
    }


    return (
        <form onSubmit={handleSubmit} className='form-login' >
            {isAltenticado && <Navigate to="/" />}
            {isError && <p className='error-msg'>{msgError}</p>}
            <div className="propiety-login-div">
                <label className='label-email' htmlFor='input-email' >Email</label>
                <input type="email" placeholder="Email" className='input-email' ref={email} />
            </div>

            <div className="propiety-login-div">
                <label className='label-senha' htmlFor='input-senha' >Senha</label>
                <input type="password" placeholder="Senha" className='input-senha' ref={senha} />
            </div>

            <div className="Lembrar-login-div">
                <input type='checkbox' className='checkbox-lembrar' ref={lembrar} />
                <label className='label-lembrar' htmlFor='checkbox-lembrar'  >Lembrar-me</label>
            </div>

            <button type='submit' className='btn-login'>Entrar</button>
        </form >

    )
}