import { useRef, useState } from "react";
import { useAuth, api_url } from "../../../../Contexts/AuthContext";
import axios from "axios";
import './AdicionarCategoria.css'
import { MoneyValidation } from "../AdicionarTransacaoForm";
import { ICategoria } from "../../../Categoria";
import IconSelect from "./Components/IconSelect";


interface IAdicionarCategoriaFormProps {
    setExibirAdicionarCategoriaForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AdicionarCategoriaForm({ setExibirAdicionarCategoriaForm }: IAdicionarCategoriaFormProps) {

    const { user } = useAuth();
    if (!user) return <p>Usuário não encontrado</p>

    const nome = useRef<HTMLInputElement>(null);
    const descricao = useRef<HTMLTextAreaElement>(null);
    const OrcamentoCheckbox = useRef<HTMLInputElement>(null);
    const orcamento = useRef<HTMLInputElement>(null);

    const [icone, setIcone] = useState<string>("barraquinha");

    const [showOrcamento, setShowOrcamento] = useState<boolean>(false);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!nome.current?.value) {
            alert('Preencha todos os campos')
            return
        }

        const descricaovalue = descricao.current?.value ? descricao.current?.value : 'Sem descrição'
        const orcamentoValue = OrcamentoCheckbox.current?.checked && orcamento.current?.value ? orcamento.current.value.replace(/[^0-9]/g, '') : '0'

        const categoria = OrcamentoCheckbox.current?.checked ?
            {
                nome: nome.current.value,
                descricao: descricaovalue,
                orcamento: orcamentoValue,
                icone
            } :
            {
                nome: nome.current.value,
                descricao: descricaovalue,
                icone
            }

        const retorno = await axios.post<ICategoria>(`${api_url}categorias`, categoria, {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: user.access_token
            }
        });

        if (retorno.status === 401) {
            alert('Sessão expirada')
            return
        }

        setExibirAdicionarCategoriaForm(false);
    }

    return (
        <form className="add-element-form" onSubmit={handleSubmit}>
            <h2>Adicionar Categoria</h2>
            <div className="input-div">
                <label className="label-nome" htmlFor="input-nome">Nome</label>
                <input type="text" placeholder="Nome da Categoria" className="input-nome" ref={nome} required />
            </div>

            <div className="label-element-div">
                <label className="label-icone" htmlFor="input-icone">Ícone</label>
                <IconSelect />

            </div>

            <div className="checkbox-div" >
                <label className="label-orcamento" htmlFor="input-orcamento">Possui orçamento?</label>
                <input id="input-orcamento" type="checkbox" ref={OrcamentoCheckbox} onClick={() => setShowOrcamento(!showOrcamento)} />
            </div>
            {showOrcamento &&
                <div className="input-valor">
                    <label className="label-valor" htmlFor="input-valor">Valor do orçamento</label>
                    <input type="text" placeholder="R$ 0" ref={orcamento} className="input-orcamento" onChange={MoneyValidation} />
                </div>
            }

            <div className="label-element-div">
                <label htmlFor="descricao">Descrição</label>
                <textarea placeholder="Descrição" ref={descricao} className="input-descricao" />
            </div>


            <div className="button-div">
                <button type="button" onClick={() => setExibirAdicionarCategoriaForm(false)} className="cancel-form-button">Cancelar</button>
                <button type="submit" className="submit-form-button">Adicionar Categoria</button>
            </div>
        </form>

    )
}