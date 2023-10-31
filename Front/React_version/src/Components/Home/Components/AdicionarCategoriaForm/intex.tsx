import { useRef } from "react";
import { ulid } from "ulidx";
import { useAuth, api_url } from "../../../../Contexts/AuthContext";
import axios from "axios";
import './AdicionarCategoria.css'


export function AdicionarCategoriaForm() {

    const { user } = useAuth();
    if (!user) return <p>Usuário não encontrado</p>

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

        await axios.post('${api_url}Categoria', categoria).then(res => res.data).catch(err => {
            console.log(err)
        });

        if (OrcamentoCheckbox.current?.checked) {
            const orcamento_novo = {
                id_categoria: categoria.id,
                Limite: orcamento.current?.value,
            }

            await axios.post('${api_url}Orcamento', orcamento_novo).then(res => res.data).catch(err => {
                console.log(err)
            });
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