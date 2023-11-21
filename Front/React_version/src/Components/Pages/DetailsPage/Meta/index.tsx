

import { useContext, useRef, useState } from "react";
import axios from "axios";
import { api_url, useAuth } from "../../../../Contexts/AuthContext";
import { Navigate, useParams } from "react-router-dom";
import { MoneyValidation } from "../../../Home/Components/Form/AdicionarTransacaoForm";
import '../Details.css'
import { IconSelect } from "../../../Home/Components/Form/AdicionarCategoriaForm/Components/IconSelect";
import { MetasContext } from "../../../../Contexts/MetasContext";
import isDate from 'validator/lib/isDate';
import { IMeta } from "../../../List/ListMetas/Components/Meta";


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

    const { metas } = useContext(MetasContext)
    const meta = metas.find(meta => meta.id === id)

    if (!meta) return <Navigate to="/404" />

    const tituloRef = useRef<HTMLInputElement>(null)
    const descricaoRef = useRef<HTMLTextAreaElement>(null);
    const ValorDesejadoRef = useRef<HTMLInputElement>(null)
    const data = useRef<HTMLInputElement>(null);
    const [icone, setIcone] = useState<string>(meta.icon ? meta.icon : 'barraquinha');

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [redirect, setRedirect] = useState(false)

    const { user } = useAuth()
    if (!user) return <Navigate to="/login" />

    const ValidateValues = () => {

        if ((!tituloRef.current || !descricaoRef.current || !ValorDesejadoRef.current || !data.current)
            || (tituloRef.current.value === meta.titulo && descricaoRef.current.value === meta.descricao && ValorDesejadoRef.current.value.split(' ')[1] === "0" && data.current.value === meta.dataLimite.toString().split('T')[0])
        ) {
            return false
        }

        return true;
    }
    const [ableToSubmit, setAbleToSubmit] = useState(false);


    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!tituloRef.current || !descricaoRef.current || !ValorDesejadoRef.current || !data.current) return


        if (!ValidateValues()) {
            setError('Nenhuma alteração foi feita')
            return
        }

        const nome = tituloRef.current.value
        const descricao = descricaoRef.current.value === '' ? 'Sem descrição' : descricaoRef.current.value
        const valorDesejado = parseFloat(ValorDesejadoRef.current.value.split(' ')[1])
        const dataFinal = data.current.value

        let values: {
            nome?: string;
            descricao?: string;
            valorDesejado?: number;
            icone?: string;
            dataFinal?: string;
        } = {}

        if (nome !== meta.titulo && nome.length > 0) values.nome = nome;
        if (descricao !== meta.descricao && descricao.length > 0) values.descricao = descricao;
        if (valorDesejado !== meta.valor && valorDesejado > 0) values.valorDesejado = valorDesejado;
        if (dataFinal !== meta.dataLimite.toString().split('T')[0] && isDate(dataFinal, { format: 'YYYY-MM-DD', delimiters: ['-'] })) values.dataFinal = dataFinal;

        if (icone !== meta.icon) {
            values = {
                ...values,
                icone
            }
        }

        const response = await axios.patch(`${api_url}categorias/${meta.id}`, values, {
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
        // setUpdated(true);

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
                            <label htmlFor="Titulo">Titulo</label>
                            <input type="text" name="Titulo" id="Titulo"
                                ref={tituloRef}
                                placeholder="Titulo da Meta"
                                className="input-nome"
                                defaultValue={meta.titulo}
                                onChange={e => {
                                    if (e.target.value === '') e.target.value = meta.titulo;
                                    if (e.target.value.length > 100) return;

                                    setAbleToSubmit(ValidateValues())
                                }} />
                        </div>

                        <div className="label-element-div">
                            <label htmlFor="descricao">Descrição</label>
                            <textarea name="descricao" id="descricao"
                                ref={descricaoRef}
                                placeholder="Descrição da Meta"
                                defaultValue={meta.descricao}
                                className="input-descricao"
                                onChange={e => {
                                    if (e.target.value.length > 250) return;
                                    setAbleToSubmit(ValidateValues())
                                }} />
                        </div>

                        <div className="select-orcamento-group">
                            <IconSelect setIcone={setIcone} valueDefault={icone} />
                            <div className="input-valor" id="Valor-div">
                                <label htmlFor="Valor" className="label-valor">Valor Desejado</label>
                                <input type="text" name="Valor"
                                    ref={ValorDesejadoRef}
                                    id="input-Valor"
                                    defaultValue={`R$ ${meta.valor}`}
                                    onChange={(e) => {
                                        MoneyValidation(e)
                                        setAbleToSubmit(ValidateValues())
                                    }} />
                            </div>

                        </div>

                        <div className="input-div">
                            <label htmlFor="data">Data Limite</label>
                            <input type="date" placeholder="Data" ref={data} className="input-data" name="data"
                                required // para aceitar apenas datas posteriores ou iguais à data atual
                                min={new Date().toISOString().split('T')[0]}
                                // initial value
                                defaultValue={meta.dataLimite.toString().split('T')[0]}
                                disabled={meta.dataLimite < new Date()}
                                onChange={e => {
                                    if (e.target.value === '') return;
                                    setAbleToSubmit(ValidateValues())
                                }}
                            />
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
