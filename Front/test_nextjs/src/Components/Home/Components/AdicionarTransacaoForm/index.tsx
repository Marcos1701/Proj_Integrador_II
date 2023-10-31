
import { ICategoria } from "@/Components/Categoria";
import { useUser } from "@/EncapsulatedContext";
import { Suspense, useRef } from "react";
import { ulid } from "ulidx";


interface IAdicionarTransacaoFormProps {
    categorias: ICategoria[];
}

export async function AdicionarTransacaoForm({ categorias }: IAdicionarTransacaoFormProps) {

    const user = await useUser();

    const nome = useRef<HTMLInputElement>(null);
    const valor = useRef<HTMLInputElement>(null);
    const data = useRef<HTMLInputElement>(null);
    const tipo = useRef<HTMLSelectElement>(null);
    const categoria = useRef<HTMLSelectElement>(null);
    const descricao = useRef<HTMLTextAreaElement>(null);

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

        await fetch('http://localhost:3300/Transacao', {
            method: 'POST',
            body: JSON.stringify(transacao),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <Suspense fallback={
            <div className="transacoes-home-skeleton">
            </div>
        }>
            <form className="adicionar-transacao-form" onSubmit={handleSubmit}>
                <input type="text" placeholder="Nome da Transação" ref={nome} />
                <input type="number" placeholder="Valor" ref={valor} />
                <input type="date" placeholder="Data" ref={data} />
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