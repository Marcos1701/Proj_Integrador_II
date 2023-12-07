import { Navigate } from "react-router-dom";
import { api_url, useAuth } from "../../../../Contexts/AuthContext";
import { ICategoria } from "../../../List/ListCategorias/Components/Categoria";
import { useContext, useRef, useState } from "react";
import { CategoriasOrderContext } from "../../../../Contexts/CategoriasContext";
import axios from "axios";
import './Details.css'
import { IconSelect } from "../../../Home/Components/Form/AdicionarCategoriaForm/Components/IconSelect";
import { MoneyValidation } from "../../../Home/Components/Form/AdicionarTransacaoForm";
import { tratarData } from "../../../List/ListTransacoesCard/Components/Transacao";

export interface IProps {
    categoria: ICategoria,
    setShowDetails: React.Dispatch<React.SetStateAction<boolean>>
    setCategoria?: React.Dispatch<React.SetStateAction<ICategoria | undefined>>
}

export function DetailCategoriaPage({ categoria, setShowDetails, setCategoria }: IProps) {

    const { user } = useAuth()
    if (!user) return <Navigate to="/login" />

    const { setUpdated } = useContext(CategoriasOrderContext)

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const nomeRef = useRef<HTMLInputElement>(null)
    const descricaoRef = useRef<HTMLTextAreaElement>(null)
    const orcamentoRef = useRef<HTMLInputElement>(null)
    const [icone, setIcone] = useState<string>(categoria.icone ? categoria.icone : 'barraquinha');

    const ValidateValues = () => {

        if ((!nomeRef.current || !descricaoRef.current || !orcamentoRef.current)
            || (nomeRef.current.value.trim() === categoria.nome && descricaoRef.current.value.trim() === categoria.descricao && orcamentoRef.current.value.split(' ')[1] === "0" && icone === categoria.icone)
        ) {
            return false
        }

        return true;
    }
    const [ableToSubmit, setAbleToSubmit] = useState(false);

    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!nomeRef.current || !descricaoRef.current || !orcamentoRef.current) return;

        if (!ValidateValues()) {
            setError('Nenhuma alteração foi feita')
            return
        }

        const nome = nomeRef.current.value
        const descricao = descricaoRef.current.value === '' ? 'Sem descrição' : descricaoRef.current.value
        const orcamento = parseFloat(orcamentoRef.current.value.replace(/[^0-9]/g, ''))

        if (nome === '') return setError('Nome não pode ser vazio')

        let data: {
            nome: string;
            descricao?: string;
            orcamento?: number | null;
            icone?: string;

        } = orcamento === 0 ? {
            nome,
            orcamento: null
        } : {
                nome,
                orcamento: Number(orcamento)
            }

        if (descricao !== categoria.descricao) {
            data = {
                ...data,
                descricao
            }
        }

        if (icone !== categoria.icone) {
            data = {
                ...data,
                icone
            }
        }

        const response = await axios.patch(`${api_url}categorias/${categoria.id}`, data, {
            headers: {
                getAuthorization: true,
                Authorization: user.access_token
            }
        })

        if (response.status !== 200 && response.status !== 201) {
            setError(response.statusText)
            return;
        }

        setError('')
        setSuccess('Categoria atualizada com sucesso')
        setUpdated(true);
        setCategoria && setCategoria(undefined)
        setShowDetails(false);
    }

    const handleDelete = async () => {
        const response = await axios.delete(`${api_url}categorias/${categoria.id}`, {
            headers: {
                getAuthorization: true,
                Authorization: user.access_token
            }
        })

        if (response.status !== 200 && response.status !== 201) {
            setError(response.statusText)
            return;
        }
        setError('')
        setSuccess('Categoria deletada com sucesso')
        setUpdated(true);
        setCategoria && setCategoria(undefined)
        setShowDetails(false);
    }

    return (
        <div className="Background-blur" id="background-form" >
            <div className="details-div"
                // onMouseLeave={(e) => {
                //     if (e.target === e.currentTarget) {
                //         setCategoria && setCategoria(undefined)
                //         setShowDetails(false)
                //     }
                // }}
                id="categoria-details"
            >
                <div className="header-details">
                    <button type="button" className="close-button" onClick={() => setShowDetails(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
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
                    <h2 className="title">Detalhes da categoria</h2>
                </div>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <form onSubmit={handleUpdate} className="element-details">
                    <div className="input-div">
                        <label htmlFor="input-nome">Nome:</label>
                        <input type="text" className="input-nome" name="input-nome" id="input-nome" ref={nomeRef} defaultValue={categoria.nome} onChange={e => {
                            if (e.target.value === '') e.target.value = categoria.nome
                            if (e.target.value.length > 100) return;

                            setAbleToSubmit(ValidateValues())
                        }} />
                    </div>

                    <div className="orcamento-div">
                        <label className="label-valor" htmlFor="input-orcamento">Orçamento:</label>
                        <input type="text" name="input-orcamento" id="input-orcamento" className="input-orcamento" ref={orcamentoRef} defaultValue={`R$ ${categoria.orcamento ? categoria.orcamento : 0}`} onChange={(e) => {
                            MoneyValidation(e)
                            setAbleToSubmit(ValidateValues())
                        }} />
                    </div>

                    <IconSelect setIcone={setIcone} valueDefault={icone} onChange={(option) => {
                        if (option.value !== categoria.icone) {
                            setAbleToSubmit(ValidateValues())
                        }
                    }} />

                    <div className="label-element-div">
                        <label htmlFor="input-descricao">Descrição:</label>
                        <textarea name="input-descricao" className="input-descricao" ref={descricaoRef} defaultValue={categoria.descricao ? categoria.descricao : ''}
                            placeholder="Descrição da Categoria"
                            id="desc_textarea"
                            onChange={e => {
                                if (e.target.value.length > 250) return;
                                setAbleToSubmit(ValidateValues())
                            }} />
                    </div>

                    <div className="dataCriacao-details">
                        <p className="created-at">Criada em: <span>{tratarData(categoria.dataCriacao.toString())}</span></p>
                    </div>

                    <div className="button-div">
                        <button type="submit" className="submit-form-button" disabled={!ableToSubmit}>Atualizar</button>
                        <button type="button" className="delete-value-form" onClick={handleDelete}>Deletar</button>
                    </div>
                </form>

            </div>
        </div>
    )
}