import axios from "axios";
import { ICategoria } from "../../../Categoria";
import { useAuth, api_url } from "../../../../Contexts/AuthContext";
import { Suspense, useRef } from "react";
import { ulid } from "ulidx";

interface IAdicionarTransacaoFormProps {
    categorias: ICategoria[];
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

export function AdicionarTransacaoForm({ categorias }: IAdicionarTransacaoFormProps) {

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

        if (!nome.current?.value || !valor.current?.value || !data.current?.value || !tipo.current?.value || !categoria.current?.value || !descricao.current?.value) {
            return
        }

        const transacao = {
            id: ulid(),
            id_usuario: user.id,
            id_categoria: categoria.current?.value,
            nome: nome.current?.value,
            valor: valor.current?.value,
            data: data.current?.value,
            tipo: tipo.current?.value,
            descricao: descricao.current?.value,
        }

        await axios.post(`${api_url}Transacao`, transacao).then(res => res.data).catch(err => {
            console.log(err)
        });
    }


    return (
        <Suspense fallback={
            <div className="transacoes-home-skeleton">
            </div>
        }>
            <form className="add-element-form" onSubmit={handleSubmit}>
                <h2>Adicionar Transação</h2>
                <input type="text" placeholder="Nome da Transação" ref={nome} className="input-nome" />
                <input type="text"
                    onChange={MoneyValidation}
                    placeholder="R$ 0"
                    pattern="R\$ [0-9]{1,3}(\.[0-9]{3})*(\,[0-9]{2})?"
                    ref={valor} className="input-valor"
                />
                <input type="date" placeholder="Data" ref={data} className="input-data" />
                <select ref={tipo}>
                    <option value="Entrada">Entrada</option>
                    <option value="Saída">Saída</option>
                </select>
                <select ref={categoria}>
                    {categorias.length > 0 ?
                        categorias.map(categoria => (
                            <option value={categoria.id}>{categoria.nome}</option>
                        ))
                        : <option value="Sem categoria">Sem categoria</option>
                    }
                </select>
                <button type="submit">Adicionar</button>
            </form>
        </Suspense>
    )
}