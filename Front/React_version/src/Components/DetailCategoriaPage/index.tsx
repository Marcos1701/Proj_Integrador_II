import { useRef, useState } from "react";
import { ICategoria } from "../Categoria"
import axios from "axios";
import { api_url, useAuth } from "../../Contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { MoneyValidation } from "../Home/Components/AdicionarTransacaoForm";
import './Detail.css'


interface IProps {
    categoria: ICategoria;
    return: string;
}

export function DetailCategoriaPage(
    {
        categoria,
        return: returnPage
    }: IProps
) {

    const nomeRef = useRef<HTMLInputElement>(null)
    const descricaoRef = useRef<HTMLInputElement>(null)
    const orcamentoRef = useRef<HTMLInputElement>(null)

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [redirect, setRedirect] = useState(false)

    const { user } = useAuth()
    if (!user) return <Navigate to="/login" />

    const ValidateValues = () => {
        if ((!nomeRef.current || !descricaoRef.current || !orcamentoRef.current)
            || (nomeRef.current.value === categoria.nome && descricaoRef.current.value === categoria.descricao && orcamentoRef.current.value === "0")
        ) {
            return false
        }

        return true;
    }

    const handleUpdate = async () => {

        if (!nomeRef.current || !descricaoRef.current || !orcamentoRef.current) return


        if (!ValidateValues()) {
            setError('Nenhuma alteração foi feita')
            return
        }

        const nome = nomeRef.current.value
        const descricao = descricaoRef.current.value === '' ? 'Sem descrição' : descricaoRef.current.value
        const orcamento = orcamentoRef.current.value.split(' ')[1].replace(/[^0-9]/g, '')

        if (nome === '') return setError('Nome não pode ser vazio')

        const data = orcamento === '0' ? {
            nome,
            descricao
        } : {
            nome,
            descricao,
            orcamento: Number(orcamento)
        }

        const response = await axios.patch(`${api_url}/categorias/${categoria.id}`, data, {
            headers: {
                getAuthorization: true,
                Authorization: user.access_token
            }
        })

        if (response.status !== 200 && response.status !== 201) {
            setError(response.statusText)
        }
        setError('')
        setSuccess('Categoria atualizada com sucesso')

        setTimeout(() => {
            setRedirect(true)
        }, 1000)
    }



    return (
        <main className="page">
            {redirect && <Navigate to={returnPage} />}
            <div className="Background-blur">
                <div className="element-details">
                    <h3>Detalhes da categoria</h3>
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}

                    <div className="values-group">
                        <div className="categoria-icon">
                            <img src={categoria.icone ? `assets/icons/${categoria.icone}.svg` : "/assets/icons/barraquinha.svg"} alt={categoria.nome} className='icon' />
                        </div>

                        <div className="categoria-info">
                            <div className="input-div">
                                <label htmlFor="nome">Nome</label>
                                <input type="text" name="nome" id="nome"
                                    defaultValue={categoria.nome}
                                    onChange={e => {
                                        if (e.target.value === '') e.target.value = categoria.nome
                                        if (e.target.value.length > 100) return;
                                    }} />
                            </div>

                            <div className="label-element-div">
                                <label htmlFor="descricao">Descrição</label>
                                <textarea name="descricao" id="descricao"
                                    placeholder="Descrição da categoria"
                                    defaultValue={categoria.descricao}
                                    className="input-descricao"
                                    onChange={e => {
                                        if (e.target.value.length > 250) return;
                                    }} />
                            </div>

                            <div className="input-div">
                                <label htmlFor="orcamento">Orçamento</label>
                                <input type="text" name="orcamento" id="orcamento"
                                    defaultValue={categoria.orcamento ? `R$ ${categoria.orcamento}` : "R$ 0"}
                                    onChange={MoneyValidation} />
                            </div>

                            <div className="dataCriacao">
                                <p>Criado em: {new Date(categoria.dataCriacao).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="bottonsUpdateGroup">
                            <button className="cancelar" onClick={() => setRedirect(true)}>Cancelar</button>
                            <button className="atualizar" onClick={handleUpdate}
                                disabled={!ValidateValues()}
                            >Salvar</button>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    )
}