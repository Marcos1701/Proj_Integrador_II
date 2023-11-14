import { useContext, useRef, useState } from "react";
import axios from "axios";
import { api_url, useAuth } from "../../../../Contexts/AuthContext";
import { Navigate, useParams } from "react-router-dom";
import { MoneyValidation } from "../../../Home/Components/Form/AdicionarTransacaoForm";
import '../Details.css'
import { TransacoesContext } from "../../../../Contexts/TransacoesContext";
import { CategoriasContext } from "../../../../Contexts/CategoriasContext";
import { ITransacao } from "../../../List/ListTransacoesCard/Components/Transacao";


interface IProps {
    return: string;
}

export function DetailsTransacaoPage(
    {
        return: returnPage
    }: IProps
) {

    const { id } = useParams();

    if (!id) return <Navigate to="/Categorias" />

    const { transacoes, setUpdated } = useContext(TransacoesContext)

    const transacao: ITransacao = transacoes.find((transacao) => transacao.id === id);

    if (!transacao) return <Navigate to="/404" />
    const categorias = useContext(CategoriasContext)

    const titulo = useRef<HTMLInputElement>(null);
    const valor = useRef<HTMLInputElement>(null);
    const data = useRef<HTMLInputElement>(null);
    const tipo = useRef<HTMLSelectElement>(null);
    const categoria = useRef<HTMLSelectElement>(null);
    const descricao = useRef<HTMLTextAreaElement>(null);

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [redirect, setRedirect] = useState(false)

    const { user } = useAuth()
    if (!user) return <Navigate to="/login" />

    const ValidateValues = () => {

        if ((!titulo.current || !descricao.current || !valor.current || !data.current || !tipo.current || !categoria.current)
            || (titulo.current.value === transacao.titulo && descricao.current.value === transacao.descricao && valor.current.value.split(' ')[1] === `${transacao.valor}` && data.current.value === transacao.data.toString().split('T')[0] && tipo.current.value === transacao.tipo && categoria.current.value === transacao.categoriaid)
        ) {
            return true;
        }

        return false
    }
    const [ableToSubmit, setAbleToSubmit] = useState(false)



    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!titulo.current || !descricao.current || !valor.current || !data.current || !tipo.current || !categoria.current) return


        if (ValidateValues()) {
            setError('Nenhuma alteração foi feita')
            return
        }
        console.log(parseFloat(valor.current.value.split(' ')[1]))

        const tituloTransacao = titulo.current.value
        const descricaoValue = descricao.current.value === '' ? 'Sem descrição' : descricao.current.value
        const ValorTransacao = parseFloat(valor.current.value.split(' ')[1])
        const dataTransacao = data.current.value
        const tipoTransacao = tipo.current.value

        if (tituloTransacao === '') return setError('Nome não pode ser vazio')
        if (ValorTransacao <= 0) return setError('Valor não pode ser menor ou igual a 0');
        if (dataTransacao === '') return setError('a Data da Transação não pode ser vazia');

        let values: {
            titulo?: string;
            descricao?: string;
            valor?: number;
            data?: Date;
            tipo?: string;
            categoriaid?: string;
        } = {}

        if (tituloTransacao !== transacao.titulo) values.titulo = tituloTransacao;
        if (descricaoValue !== transacao.descricao) values.descricao = descricaoValue;
        if (ValorTransacao !== transacao.valor) values.valor = ValorTransacao;
        if (dataTransacao !== transacao.data.toString()) values.data = new Date(dataTransacao);
        if (tipoTransacao !== transacao.tipo) values.tipo = tipoTransacao;
        if (categoria.current.value !== transacao.categoriaid) values.categoriaid = categoria.current.value;

        const response = await axios.patch(`${api_url}transacoes/${transacao.id}`, values, {
            headers: {
                getAuthorization: true,
                Authorization: user.access_token
            }
        })

        if (response.status !== 200 && response.status !== 201) {
            setError(response.statusText)
        }
        setError('')
        setSuccess('Transação atualizada com sucesso')
        setUpdated(true);

        setTimeout(() => {
            setRedirect(true)
        }, 1000)
    }



    return (
        <main className="page">
            {redirect && <Navigate to={returnPage} />}
            <form className="element-details" onSubmit={handleUpdate}>
                <h2>Detalhes da Transação</h2>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <div className="values-group" id="transacao-detail">
                    <div className="Transacao-info">
                        <div className="input-div">
                            <label htmlFor="titulo">titulo</label>
                            <input type="text" name="titulo" id="titulo"
                                ref={titulo}
                                placeholder="titulo da Categoria"
                                className="input-nome"
                                defaultValue={transacao.titulo}
                                onChange={e => {
                                    if (e.target.value.length > 100) return;
                                    setAbleToSubmit(ValidateValues())
                                }} />
                        </div>

                        <div className="valor-data-div">
                            <div className="input-div">
                                <label htmlFor="valor">Valor</label>
                                <input type="text" name="valor" id="valor"
                                    onChange={(e) => {
                                        MoneyValidation(e)
                                        setAbleToSubmit(ValidateValues())
                                    }}
                                    defaultValue={`R$ ${transacao.valor}`}
                                    ref={valor} className="input-valor"
                                    required
                                />
                            </div>

                            <div className="input-div">
                                <label htmlFor="data">Data</label>
                                <input type="date" placeholder="Data" ref={data} className="input-data" name="data"
                                    required // para aceitar apenas datas anteriores ou iguais à data atual
                                    max={new Date().toISOString().split('T')[0]}
                                    // initial value
                                    defaultValue={transacao.data.toString().split('T')[0]}
                                    onChange={e => {
                                        if (e.target.value === '') return;
                                        setAbleToSubmit(ValidateValues())
                                    }}
                                />
                            </div>
                        </div>

                        <div className="select-group">

                            <div className="label-element-div">
                                <label htmlFor="tipo">Tipo</label>
                                <select id="tipo" name="tipo" ref={tipo} required defaultValue={transacao.tipo}>
                                    <option value="" disabled>Selecione um tipo</option>
                                    <option value="entrada">Entrada</option>
                                    <option value="saida">Saída</option>
                                </select>
                            </div>

                            <div className="label-element-div">
                                <label htmlFor="categoria">Categoria</label>
                                <select ref={categoria} required defaultValue={transacao.categoriaid}>
                                    <option value="" disabled>Selecione uma categoria</option>
                                    {
                                        // categorias.length > 0 ?
                                        categorias.map(categoria => (
                                            <option key={categoria.id + 'key'} value={categoria.id}>{categoria.nome}</option>
                                        ))
                                        // : <option value="Sem categoria">Sem categoria</option>
                                    }
                                </select>
                            </div>

                        </div>
                        <div className="label-element-div">
                            <label htmlFor="descricao">Descrição</label>
                            <textarea name="descricao" id="descricao"
                                ref={descricao}
                                placeholder="Descrição da transação"
                                defaultValue={transacao.descricao}
                                className="input-descricao"
                                onChange={e => {
                                    if (e.target.value.length > 250) return;
                                    setAbleToSubmit(ValidateValues())
                                }} />
                        </div>

                    </div>

                    <div className="button-div">
                        <button className="cancel-form-button" onClick={() => setRedirect(true)}>Cancelar</button>
                        <button className="submit-form-button" type="submit"
                            disabled={ableToSubmit}
                        >Salvar</button>
                    </div>

                </div>

            </form>

        </main>
    )
}