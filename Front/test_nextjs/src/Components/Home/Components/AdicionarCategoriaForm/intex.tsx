import { useUser } from "@/EncapsulatedContext";
import { useRef } from "react";
import { ulid } from "ulidx";


export async function AdicionarCategoriaForm() {

    const user = await useUser();
    const nome = useRef<HTMLInputElement>(null);
    const descricao = useRef<HTMLTextAreaElement>(null);
    const OrcamentoCheckbox = useRef<HTMLInputElement>(null);
    const orcamento = useRef<HTMLInputElement>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!nome.current?.value || !descricao.current?.value || !OrcamentoCheckbox.current?.value || !orcamento.current?.value) {
            return
        }

        const categoria = {
            id: ulid(),
            id_usuario: user!.id,
            nome: nome.current?.value,
            descricao: descricao.current?.value,
        }

        await fetch('http://localhost:3300/Categoria', {
            method: 'POST',
            body: JSON.stringify(categoria),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })

        if (OrcamentoCheckbox.current?.checked) {
            const orcamento_novo = {
                id_categoria: categoria.id,
                Limite: orcamento.current?.value,
            }

            await fetch('http://localhost:3300/Orcamento', {
                method: 'POST',
                body: JSON.stringify(orcamento_novo),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json()).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        }
    }

    return (
        <form className="adicionar-categoria-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Nome da Categoria" ref={nome} />
            <textarea placeholder="Descrição" ref={descricao} />
            <input type="checkbox" ref={OrcamentoCheckbox} />
            {OrcamentoCheckbox.current?.checked &&
                <input type="number" placeholder="Orçamento" ref={orcamento} />
            }
            <button type="submit">Adicionar Categoria</button>
        </form>
    )
}