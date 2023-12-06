import axios from "axios";
import { useAuth, api_url } from "../../../../../Contexts/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import { CategoriasContext, CategoriasOrderContext, CategoriasOrderContextData } from "../../../../../Contexts/CategoriasContext";
import { TransacoesContext, TransacoesContextData } from "../../../../../Contexts/TransacoesContext";
import "../Form.css"
import { Navigate } from "react-router-dom";


export const MoneyValidation = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '') {
        return
    }

    // remover tudo o que não for número
    const valueAsNumber = Number(value.replace(/[^0-9]/g, ''));
    if (isNaN(valueAsNumber) || valueAsNumber < 0 || valueAsNumber >= 10000000000) {
        event.target.value = event.target.value.slice(0, -1);
        return;
    }

    // formatar o número para dinheiro, sem as casas decimais
    const valueAsMoney = valueAsNumber.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0
    });

    event.target.value = valueAsMoney;
}

export function AdicionarTransacaoForm() {

    const categorias = useContext(CategoriasContext);

    const titulo = useRef<HTMLInputElement>(null);
    const valor = useRef<HTMLInputElement>(null);
    const data = useRef<HTMLInputElement>(null);
    const tipo = useRef<HTMLSelectElement>(null);
    const categoria = useRef<HTMLSelectElement>(null);
    const descricao = useRef<HTMLTextAreaElement>(null);

    const { user } = useAuth();
    if (!user) return <p>Usuário não encontrado</p>

    const [msgSucesso, setMsgSucesso] = useState<boolean>(false);
    const [msgErro, setMsgErro] = useState<boolean>(false);
    const [msgErroText, setMsgErroText] = useState<string>('')
    const { setUpdated }: TransacoesContextData = useContext(TransacoesContext)
    const { setUpdated: setUpdatedCat }: CategoriasOrderContextData = useContext(CategoriasOrderContext)
    const [retorno, setRetorno] = useState<boolean>(false);

    const [ableCategoria, setAbleCategoria] = useState<boolean>(false);

    const [abletoAdd, setAbletoAdd] = useState<boolean>(false);

    const validate = () => {
        if (titulo.current?.value && valor.current?.value && data.current?.value && tipo.current?.value && (categoria.current?.value || tipo.current?.value === 'entrada')) {
            return setAbletoAdd(true);
        }
        setAbletoAdd(false);
    }


    useEffect(() => {
        validate();
    }, [titulo.current?.value, valor.current?.value, data.current?.value, tipo.current?.value])
    // habilitar o select de categorias se houver categorias

    useEffect(() => {
        if (categorias.length > 0 && tipo.current?.value === 'saida') {
            setAbleCategoria(true);
        }
    }, [categorias, tipo.current?.value])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!titulo.current?.value || !valor.current?.value || !data.current?.value || !tipo.current?.value) {
            return
        }

        if (!categoria.current?.value && tipo.current?.value === 'saida') {
            setMsgErro(true);
            setMsgErroText('Selecione uma categoria');
            return;
        }

        const transacao: {
            titulo: string,
            valor: number,
            data: Date,
            tipo: string,
            descricao?: string,
            categoriaid?: string
        } =
            !descricao.current?.value || descricao.current?.value === '' ?
                {
                    titulo: titulo.current.value,
                    valor: Number(valor.current.value.replace(/[^0-9]/g, '')),
                    data: new Date(data.current.value),
                    tipo: tipo.current.value,
                } :
                {
                    titulo: titulo.current.value,
                    valor: Number(valor.current.value.replace(/[^0-9]/g, '')),
                    data: new Date(data.current.value),
                    tipo: tipo.current.value,
                    descricao: descricao.current.value,
                }
        if (categoria.current?.value) {
            transacao.categoriaid = categoria.current.value;
        }

        await axios.post(`${api_url}transacoes`, transacao, {
            headers: {
                getAuthorization: true,
                Authorization: user.access_token
            },
        }).then(res => res.data).catch(err => {
            console.log(err)
            setMsgErro(true);
            setMsgErroText(err.response.data.message);
            return;
        });

        // limpar os campos
        titulo.current.value = '';
        valor.current.value = 'R$ 0';
        data.current.value = new Date().toISOString().split('T')[0];
        tipo.current.value = '';
        if (categoria.current) {
            categoria.current.value = '';
            setUpdatedCat(true);
        }

        if (descricao.current) {
            descricao.current.value = '';
        }

        setUpdated(true);
        setMsgSucesso(true);
        setTimeout(() => {
            setMsgSucesso(false);
            setRetorno(true);
        }, 3000);
    }


    return (

        <form className="add-element-form" onSubmit={handleSubmit}>

            {msgSucesso && <p className="successmsg">Transação adicionada com sucesso!</p>}
            {msgErro && <p className="errormsg">{msgErroText}</p>}
            {retorno && <>
                <p className="successmsg">Redirecionando...</p>
                <Navigate to="/" />
            </>
            }
            <div className="input-div">
                <label htmlFor="titulo">Titulo</label>
                <input type="text" placeholder="Titulo da Transação" ref={titulo} className="input-nome" required onChange={validate} />
            </div>

            <div className="valor-data-div">
                <div className="input-div">
                    <label htmlFor="valor">Valor</label>
                    <input type="text"
                        onChange={(
                            (event: React.ChangeEvent<HTMLInputElement>) => {
                                MoneyValidation(event)
                                validate()
                            }
                        )}
                        defaultValue="R$ 0"
                        ref={valor} className="input-valor"
                        required
                    />
                </div>

                <div className="input-div">
                    <label htmlFor="data">Data</label>
                    <input type="date" placeholder="Data" ref={data} className="input-data"
                        required // para aceitar apenas datas anteriores ou iguais à data atual
                        max={new Date().toISOString().split('T')[0]}
                        // initial value
                        defaultValue={new Date().toISOString().split('T')[0]}
                        onChange={validate}
                    />
                </div>
            </div>

            <div className="select-group">

                <div className="label-element-div">
                    <label htmlFor="tipo">Tipo</label>
                    <select ref={tipo} required defaultValue='' onChange={
                        (event) => {
                            validate();
                            if (event.target.value === 'saida') {
                                return setAbleCategoria(true);
                            }
                            setAbleCategoria(false);
                        }
                    }>
                        <option value="" disabled>Selecione o tipo</option> {/* o value vazio é necessário para o required funcionar */}
                        <option value="entrada">Entrada</option>
                        <option value="saida"
                            disabled={categorias.length === 0}
                            // desabilitar a opção de saída se não houver categorias
                            title={
                                categorias.length === 0 ? // se não houver categorias, exibir o título
                                    'Adicione uma categoria para poder adicionar uma transação de saída' :
                                    '' // se houver categorias, não exibir o título
                            }
                        >Saída</option>
                    </select>
                </div>

                {ableCategoria && // se o tipo for saída, exibir o select de categorias
                    <div className="label-element-div">
                        <label htmlFor="categoria">Categoria</label>
                        <select ref={categoria} required defaultValue='' onChange={validate}>
                            <option value="" disabled>Selecione uma categoria</option>
                            {
                                categorias.map(categoria => (
                                    <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                                ))
                            }
                        </select>
                    </div>
                }
            </div>

            <div className="label-element-div">
                <label htmlFor="descricao">Descrição</label>
                <textarea placeholder="Descrição" ref={descricao} className="input-descricao" />
            </div>

            <div className="button-div">
                <button type="button" onClick={() => setRetorno(true)} className="cancel-form-button">Cancelar</button>
                <button type="submit" className="submit-form-button" disabled={!abletoAdd}>Adicionar</button>
            </div>
        </form >

    )
}