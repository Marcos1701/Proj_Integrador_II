import { useRef, useState } from "react"
import { singupData, useAuth } from '../../../../../Contexts/AuthContext';
import { Navigate } from "react-router-dom";
import "./FormCadastro.css"

export function FormCadastro() {

    const { singup } = useAuth()

    const [isAltenticado, setIsAutenticado] = useState<boolean>(false)

    const nome = useRef<HTMLInputElement>(null)
    const email = useRef<HTMLInputElement>(null)
    const senha = useRef<HTMLInputElement>(null)
    const lembrar = useRef<HTMLInputElement>(null)

    const [isError, setIsError] = useState(false)
    const [msgError, setMsgError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!nome.current?.value || !email.current?.value || !senha.current?.value || !lembrar.current) {
            setIsError(true)
            setMsgError('Preencha todos os campos')
            return
        }
        setIsError(false);

        const dados: singupData = {
            nome: nome.current.value,
            email: email.current.value,
            senha: senha.current.value,
            lembrar: lembrar.current.checked
        }

        const error = await singup(dados)


        if (error) {
            setIsError(true)
            setMsgError(error)
            return
        }
        setIsAutenticado(true)
    }

    return (
        <form onSubmit={handleSubmit} className='form-cadastro'>
            {isAltenticado && <Navigate to="/" />}
            {isError && <p className='error-msg'>{msgError}</p>}
            <label className='label-usuario' htmlFor='input-Nome' >Nome</label>
            <input type="text" placeholder="Digite seu nome" className='input-Nome' ref={nome} />

            {isError && <p className='error-msg'>{msgError}</p>}
            <label className='label-usuario' htmlFor='input-email' >Email</label>
            <input type="email" placeholder="Email" className='input-email' ref={email} />

            {isError && <p className='error-msg'>{msgError}</p>}
            <label className='label-senha' htmlFor='input-senha' >Senha</label>
            <input type="password" placeholder="Senha" className='input-senha' ref={senha} />


            <input type='checkbox' className='checkbox-lembrar' ref={lembrar} />
            <label className='label-lembrar' htmlFor='checkbox-lembrar' >Lembrar-me</label>

            <input type="submit" value="Cadastrar" className='button-Cadastrar' />
        </form>
    )

    // quando o usuario clica em lembrar, o email e senha ficam salvos no localstorage
}