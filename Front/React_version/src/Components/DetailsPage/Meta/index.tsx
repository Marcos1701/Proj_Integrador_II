

import { useContext, useRef, useState } from "react";
import axios from "axios";
import { api_url, useAuth } from "../../../Contexts/AuthContext";
import { Navigate, useParams } from "react-router-dom";
import { MoneyValidation } from "../../Home/Components/AdicionarTransacaoForm";
import '../Details.css'
import { IconSelect } from "../../Home/Components/AdicionarCategoriaForm/Components/IconSelect";
import { tratarData } from "../../Transacao";
import { MetasContext } from "../../../Contexts/MetasContext";


interface IProps {
    return: string;
}

export function DetailsMetaPage(
    {
        return: returnPage
    }: IProps
) {

    const { id } = useParams();

    if (!id) return <Navigate to="/Categorias" />

    const meta = useContext(MetasContext).find(meta => meta.id === id);

    if (!meta) return <Navigate to="/404" />

    const tituloRef = useRef<HTMLInputElement>(null)
    const descricaoRef = useRef<HTMLTextAreaElement>(null);
    const ValorDesejadoRef = useRef<HTMLInputElement>(null)
    const [icone, setIcone] = useState<string>(meta.icon ? meta.icon : 'barraquinha');

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [redirect, setRedirect] = useState(false)

    const { user } = useAuth()
    if (!user) return <Navigate to="/login" />

    const ValidateValues = () => {

        if ((!tituloRef.current || !descricaoRef.current || !ValorDesejadoRef.current)
            || (tituloRef.current.value === meta.titulo && descricaoRef.current.value === meta.descricao && ValorDesejadoRef.current.value.split(' ')[1] === "0")
        ) {
            return false
        }

        return true;
    }
    const [ableToSubmit, setAbleToSubmit] = useState(false);


    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!tituloRef.current || !descricaoRef.current || !ValorDesejadoRef.current) return


        if (!ValidateValues()) {
            setError('Nenhuma alteração foi feita')
            return
        }

        const nome = tituloRef.current.value
        const descricao = descricaoRef.current.value === '' ? 'Sem descrição' : descricaoRef.current.value
        const orcamento = parseFloat(ValorDesejadoRef.current.value.split(' ')[1])

        if (nome === '') return setError('Nome não pode ser vazio')

        let data: {
            nome: string;
            descricao: string;
            orcamento?: number;
            icone?: string;

        } = orcamento === 0 ? {
            nome,
            descricao
        } : {
                nome,
                descricao,
                orcamento: Number(orcamento)
            }

        if (icone !== meta.icon) {
            data = {
                ...data,
                icone
            }
        }

        const response = await axios.patch(`${api_url}categorias/${meta.id}`, data, {
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

        setTimeout(() => {
            setRedirect(true)
        }, 1000)
    }



    return (
        <main className="page">
            {redirect && <Navigate to={returnPage} />}
            <form className="element-details" onSubmit={handleUpdate}>
                <h2>Detalhes da categoria</h2>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <div className="values-group">
                    <div className="categoria-info">
                        <div className="input-div">
                            <label htmlFor="nome">Nome</label>
                            <input type="text" name="nome" id="nome"
                                ref={tituloRef}
                                placeholder="Nome da Categoria"
                                className="input-nome"
                                defaultValue={meta.nome}
                                onChange={e => {
                                    if (e.target.value === '') e.target.value = meta.nome
                                    if (e.target.value.length > 100) return;

                                    setAbleToSubmit(ValidateValues())
                                }} />
                        </div>

                        <div className="label-element-div">
                            <label htmlFor="descricao">Descrição</label>
                            <textarea name="descricao" id="descricao"
                                ref={descricaoRef}
                                placeholder="Descrição da categoria"
                                defaultValue={meta.descricao}
                                className="input-descricao"
                                onChange={e => {
                                    if (e.target.value.length > 250) return;
                                    setAbleToSubmit(ValidateValues())
                                }} />
                        </div>

                        <div className="select-orcamento-group">
                            <IconSelect setIcone={setIcone} valueDefault={icone} />
                            <div className="input-valor" id="orcamento-div">
                                <label htmlFor="orcamento" className="label-valor">Orçamento</label>
                                <input type="text" name="orcamento"
                                    ref={ValorDesejadoRef}
                                    id="input-orcamento"
                                    defaultValue={meta.orcamento ? `R$ ${meta.orcamento}` : "R$ 0"}
                                    onChange={(e) => {
                                        MoneyValidation(e)
                                        setAbleToSubmit(ValidateValues())
                                    }} />
                            </div>

                        </div>

                        <div className="dataCriacao">
                            <p className="created-at">Criado em: <span>{tratarData(meta.dataCriacao.toString())}</span></p>
                        </div>
                    </div>

                    <div className="button-div">
                        <button className="cancel-form-button" onClick={() => setRedirect(true)}>Cancelar</button>
                        <button className="submit-form-button" type="submit" disabled={!ableToSubmit}>Salvar</button>
                    </div>

                </div>

            </form>

        </main>
    )
}