import { Navigate } from "react-router-dom";
import { useAuth, api_url } from '../../../Contexts/AuthContext';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import './perfil.css'

export interface UserData {
    nome: string;
    email: string;
    senha: string;
}

export function PerfilPage() {

    const { user } = useAuth()
    if (!user) return <Navigate to='\login' />

    const [dados, setdados] = useState<UserData | null>(null)

    const nomeref = useRef<HTMLInputElement>(null)
    const emailref = useRef<HTMLInputElement>(null)
    const senharef = useRef<HTMLInputElement>(null)
    const [deleted, setdeleted] = useState<boolean>(false);
    const [updated, setUpdated] = useState<boolean>(false);
    const [voltar, setVoltar] = useState<boolean>(false);

    const getData = async () => {
        const response = await axios.get(`${api_url}usuarios/me`, {
            headers: {
                Authorization: user.access_token
            }
        })
        setdados(response.data)
    }

    useEffect(() => {
        getData()
    }, [updated])

    const HandleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!nomeref.current?.value || !emailref.current?.value || !senharef.current?.value) {
            return
        }

        const values: {
            access_token: string,
            nome?: string,
            email?: string,
            senha?: string,
        }
            = {
            access_token: user.access_token
        }

        if (nomeref.current.value !== dados?.nome) values.nome = nomeref.current.value;
        if (emailref.current.value !== dados?.email) values.email = emailref.current.value;
        if (senharef.current.value !== dados?.senha) values.senha = senharef.current.value;

        const response = await axios.patch(`${api_url}usuarios`, values)
        if (response.status == 200) {
            localStorage.setItem('access_token', JSON.stringify(response.data))
            await getData()
            localStorage.setItem('nome', JSON.stringify(dados?.nome))
            setUpdated(true)
        }
    }

    const HandleDelete = async () => {

        const response = await axios.delete(`${api_url}usuarios`, {
            headers: {
                Authorization: user.access_token
            }
        })

        if (response.status == 204) {
            setdeleted(true)
        }

    }


    return (
        <main className="perfil">
            {deleted && <Navigate to='/login' />}
            {voltar && <Navigate to={'/'} />}
            <div className="page-header">
                <button onClick={() => { setVoltar(!voltar) }}
                    className="back-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none">
                        <g clipPath="url(#clip0_206_145)">
                            <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" fill="black" />
                        </g>
                        <defs>
                            <clipPath id="clip0_206_145">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>

                <h2 className="title">Perfil</h2>
            </div>

            <form onSubmit={HandleUpdate} className="perfil-form" id="perfil-form">
                <div className="input-div" id="nome-div">
                    <label htmlFor="nome">Nome</label>
                    <input type="text" name="nome" id="nome"
                        ref={nomeref}
                        placeholder="nome do usuario"
                        className="input-nome"
                        defaultValue={dados ? dados?.nome : ''}
                        onChange={e => {
                            if (e.target.value === '') e.target.value = dados ? dados.nome : '';
                            if (e.target.value.length > 100) return;
                        }} />
                </div>

                <div className="input-div" >
                    <label htmlFor="email">email</label>
                    <input type="text" name="email" id="email"
                        ref={emailref}
                        placeholder="email do usuario"
                        className="input-email"
                        defaultValue={dados ? dados?.email : ''}
                        onChange={e => {
                            if (e.target.value === '') e.target.value = dados ? dados.email : ''
                            if (e.target.value.length > 100) return;
                        }} />
                </div>

                <div className="input-div">
                    <label htmlFor="senha">senha</label>
                    <input name="senha" id="senha"
                        ref={senharef}
                        placeholder="senha do usuario"
                        className="input-senha"
                        type='password'
                        defaultValue={dados ? dados?.senha : ''}
                        onChange={e => {
                            if (e.target.value === '') e.target.value = dados ? dados.senha : ''
                            if (e.target.value.length > 100) return;
                        }} />
                </div>

                <div className="button-div">
                    <button className="submit-form-button" type="submit" >Salvar</button>
                    <button type="button" className="delete-value-form" onClick={HandleDelete}>Deletar</button>
                </div>
            </form>
        </main>
    )
}