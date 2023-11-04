import axios from "axios";
import { ICategoria } from "../../../Categoria";
import { useAuth, api_url } from "../../../../Contexts/AuthContext";
import { useRef } from "react";
import { ulid } from "ulidx";
import { redirect } from "react-router-dom";

interface IAdicionarTransacaoFormProps {
    categorias: ICategoria[];
    setExibirAdicionarTransacaoForm: React.Dispatch<React.SetStateAction<boolean>>;
}


export const MoneyValidation = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '') {
        return
    }

    // remover tudo o que não for número
    const valueAsNumber = Number(value.replace(/[^0-9]/g, ''));
    if (isNaN(valueAsNumber) || valueAsNumber < 0 || valueAsNumber > 100000000000) {
        event.target.value = event.target.value.slice(0, -1);
        return;
    }

    // formatar o número para dinheiro, sem as casas decimais
    const valueAsMoney = valueAsNumber.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    event.target.value = valueAsMoney;
}

export function AdicionarTransacaoForm({ categorias, setExibirAdicionarTransacaoForm }: IAdicionarTransacaoFormProps) {

    if (!categorias || categorias.length === 0) {
        confirm("Você precisa adicionar uma categoria antes de adicionar uma transação");
        redirect('/');
    }
    const nome = useRef<HTMLInputElement>(null);
    const valor = useRef<HTMLInputElement>(null);
    const data = useRef<HTMLInputElement>(null);
    const tipo = useRef<HTMLSelectElement>(null);
    const categoria = useRef<HTMLSelectElement>(null);
    const descricao = useRef<HTMLTextAreaElement>(null);

    const { user } = useAuth();
    if (!user) return <>
        <p>Usuário não encontrado</p>
    </>

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!nome.current?.value || !valor.current?.value || !data.current?.value || !tipo.current?.value || !categoria.current?.value) {
            return
        }

        const transacao =
            !descricao.current?.value || descricao.current?.value === '' ?
                {
                    id: ulid(),
                    id_usuario: user.id,
                    id_categoria: categoria.current.value,
                    nome: nome.current.value,
                    valor: valor.current.value.replace(/[^0-9]/g, ''),
                    data: data.current.value,
                    tipo: tipo.current.value,
                } :
                {
                    id: ulid(),
                    id_usuario: user.id,
                    id_categoria: categoria.current.value,
                    nome: nome.current.value,
                    valor: valor.current.value.replace(/[^0-9]/g, ''),
                    data: data.current.value,
                    tipo: tipo.current.value,
                    descricao: descricao.current.value,
                }

        await axios.post(`${api_url}Transacao`, transacao).then(res => res.data).catch(err => {
            console.log(err)
        });

        // limpar os campos
        // nome.current.value = '';
        // valor.current.value = '';
        // data.current.value = '';
        // tipo.current.value = '';
        // categoria.current.value = '';
        // if (descricao.current) {
        //     descricao.current.value = '';
        // }

        setExibirAdicionarTransacaoForm(false);
    }


    return (

        <form className="add-element-form" onSubmit={handleSubmit}>
            <h2>Adicionar Transação</h2>

            <div className="input-div">
                <label htmlFor="nome">Nome</label>
                <input type="text" placeholder="Nome da Transação" ref={nome} className="input-nome" required />
            </div>

            <div className="valor-data-div">
                <div className="input-div">
                    <label htmlFor="valor">Valor</label>
                    <input type="text"
                        onChange={MoneyValidation}
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
                    />
                </div>
            </div>

            <div className="select-group">

                <div className="label-element-div">
                    <label htmlFor="tipo">Tipo</label>
                    <select ref={tipo} required>
                        <option value="" selected disabled>Selecione o tipo</option> {/* o value vazio é necessário para o required funcionar */}
                        <option value="Entrada">Entrada</option>
                        <option value="Saída">Saída</option>
                    </select>
                </div>

                <div className="label-element-div">
                    <label htmlFor="categoria">Categoria</label>
                    <select ref={categoria} required>
                        <option value="" selected disabled>Selecione uma categoria</option>
                        {
                            // categorias.length > 0 ?
                            categorias.map(categoria => (
                                <option value={categoria.id}>{categoria.nome}</option>
                            ))
                            // : <option value="Sem categoria">Sem categoria</option>
                        }
                    </select>
                </div>
            </div>

            <div className="label-element-div">
                <label htmlFor="descricao">Descrição</label>
                <textarea placeholder="Descrição" ref={descricao} className="input-descricao" />
            </div>

            <div className="button-div">
                <button type="button" onClick={() => setExibirAdicionarTransacaoForm(false)} className="cancel-form-button">Cancelar</button>
                <button type="submit" className="submit-form-button">Adicionar</button>
            </div>
        </form>

    )
}