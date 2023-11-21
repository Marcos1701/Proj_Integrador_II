import { useContext, useRef, useState } from "react";
import { useAuth, api_url } from "../../../../../Contexts/AuthContext";
import axios from "axios";
import { MoneyValidation } from "../AdicionarTransacaoForm";
import { IMeta } from "../../../../List/ListMetas/Components/Meta";
import { MetasContext } from "../../../../../Contexts/MetasContext";
import { IconSelect } from "../AdicionarCategoriaForm/Components/IconSelect";


interface IAdicionarMetaFormProps {
    setExibirAdicionarMetaForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AdicionarMetaForm({ setExibirAdicionarMetaForm }: IAdicionarMetaFormProps) {

    const { user } = useAuth();
    if (!user) return <p>Usuário não encontrado</p>

    const titulo = useRef<HTMLInputElement>(null);
    const descricao = useRef<HTMLTextAreaElement>(null);
    const valor = useRef<HTMLInputElement>(null);
    const dataLimite = useRef<HTMLInputElement>(null);

    const [icone, setIcone] = useState<string>("barraquinha");

    const { setUpdated } = useContext(MetasContext)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!titulo.current?.value || !valor.current?.value || !dataLimite.current?.value) {
            alert('Preencha todos os campos obrigatórios')
            return
        }

        if (titulo.current.value.length <= 3) {
            alert('Título muito curto')
            return
        }

        if (descricao.current?.value && descricao.current.value.length > 0 && descricao.current.value.length <= 3) {
            alert('Descrição muito curta')
            return
        }

        const valorValue = valor.current?.value ? Number(valor.current.value.replace(/[^0-9]/g, '')) : 0

        if (isNaN(valorValue) || valorValue <= 0) {
            alert('Valor inválido')
            return
        }

        const descricaovalue = descricao.current?.value ? descricao.current?.value : ''

        const meta = descricaovalue.length > 0 ?
            {
                titulo: titulo.current.value,
                descricao: descricaovalue,
                icone,
                valor: valorValue,
                dataLimite: new Date(dataLimite.current?.value)
            } :
            {
                titulo: titulo.current.value,
                icone,
                valor: valorValue,
                dataLimite: new Date(dataLimite.current?.value)
            }


        const retorno = await axios.post<IMeta>(`${api_url}meta`, meta, {
            headers: {
                getAuthorization: true,
                Authorization: user.access_token
            }
        });

        if (retorno.status === 401) {
            alert('Sessão expirada')
            return
        }

        if (retorno.status !== 201) {
            alert('Erro ao adicionar meta')
            return
        }

        setUpdated(true); // atualizar metas
        setExibirAdicionarMetaForm(false);
    }

    return (
        <form className="add-element-form" onSubmit={handleSubmit}>
            <h2>Adicionar Meta</h2>
            <div className="input-div">
                <label className="label-nome" htmlFor="input-nome">Nome</label>
                <input type="text" placeholder="Nome da Categoria" className="input-nome" ref={titulo} required />
            </div>

            <IconSelect setIcone={setIcone} />

            <div className="input-valor" id="valor-div">
                <label className="label-valor" htmlFor="input-valor">Valor da meta</label>
                <input type="text" placeholder="R$ 0" ref={valor} className="input-valor" onChange={MoneyValidation} required />
            </div>

            <div className="input-div" id="data-div">
                <label className="label-data" htmlFor="input-data">Data limite</label>
                <input type="date" ref={dataLimite} className="input-data"
                    min={new Date().toISOString().split('T')[0]}
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required />
            </div>

            <div className="label-element-div">
                <label htmlFor="input-descricao">Descrição</label>
                <textarea placeholder="Descrição" ref={descricao} className="input-descricao" />
            </div>


            <div className="button-div">
                <button type="button" onClick={() => setExibirAdicionarMetaForm(false)} className="cancel-form-button">Cancelar</button>
                <button type="submit" className="submit-form-button">Adicionar Categoria</button>
            </div>
        </form>

    )
}