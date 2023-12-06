import React, { Ref, useContext, useRef, useState } from "react";
import { useAuth, api_url } from "../../../../../Contexts/AuthContext";
import axios from "axios";
import { MoneyValidation } from "../AdicionarTransacaoForm";
import { IMeta } from "../../../../List/ListMetasV2/Components/Meta";
import { MetasContext } from "../../../../../Contexts/MetasContext";
import { IconSelect } from "../AdicionarCategoriaForm/Components/IconSelect";
import { Navigate } from "react-router-dom";
import { ulid } from "ulidx";
import './AdicionarMetaForm.css'

export function AdicionarMetaForm() {

    const { user } = useAuth();
    if (!user) return <p>Usuário não encontrado</p>

    const titulo = useRef<HTMLInputElement>(null);
    const descricao = useRef<HTMLTextAreaElement>(null);
    const valor = useRef<HTMLInputElement>(null);
    const dataLimite = useRef<HTMLInputElement>(null);

    const [icone, setIcone] = useState<string>("barraquinha");

    const [retornar, setRetornar] = useState<boolean>(false); // para retornar à página anterior após adicionar a meta

    // guardar submetas em um array
    const [SubMetas, setSubMetas] = useState<{
        id: string,
        refTitle: React.RefObject<HTMLInputElement>,
        ref: React.RefObject<HTMLInputElement>
    }[]>([]);

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
        })

        if (retorno.status === 401) {
            alert('Sessão expirada')
            return
        }

        if (retorno.status !== 201) {
            alert('Erro ao adicionar meta')
            return
        }

        const { id } = retorno.data

        const submetas = SubMetas.map((submeta) => {
            return {
                titulo: submeta.refTitle.current?.value || '',
                valor: Number(submeta.ref.current?.value?.replace(/[^0-9]/g, ''))
            }
        }).filter((submeta) => submeta.titulo.length > 0 && submeta.valor > 0)

        if (submetas.length > 0) {
            const retornoSubMetas = await axios.post(`${api_url}meta/${id}/sub-meta/many`, submetas, {
                headers: {
                    getAuthorization: true,
                    Authorization: user.access_token
                }
            })

            if (retornoSubMetas.status === 401) {
                alert('Sessão expirada')
                return
            }

            if (retornoSubMetas.status !== 201) {
                alert('Erro ao adicionar submetas')
                return
            }
        }

        setUpdated(true); // atualizar metas
        setRetornar(true); // retornar à página anterior
    }

    const handleAddSubMeta = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        setSubMetas(oldSubMetas => [...oldSubMetas, { id: ulid(), ref: React.createRef(), refTitle: React.createRef() }]);
    }

    return (
        <form className="add-element-form" onSubmit={handleSubmit} id="AddMetaForm">

            {retornar && <Navigate to={'/'} />}
            <div className="input-div">
                <label className="label-nome" htmlFor="input-nome">Nome</label>
                <input type="text" placeholder="Nome da Categoria" className="input-nome" ref={titulo} required />
            </div>

            <IconSelect setIcone={setIcone} />

            <div className="group_vlues">
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
            </div>

            <div className="label-element-div" id="desc_meta">
                <label htmlFor="input-descricao">Descrição</label>
                <textarea placeholder="Descrição" ref={descricao} className="input-descricao" />
            </div>

            <div className="label-element-div" id="submetasDiv">
                <div className="label-element-div" id="submetaslabelDiv">
                    <label htmlFor="add-submeta">Submetas</label>
                    <a href="#" onClick={handleAddSubMeta} className="add-submeta">Adicionar submeta</a>
                </div>
                <div className="submeta-div">
                    {SubMetas.map(({ id, ref, refTitle }) => (
                        <div key={id} className="submeta-input-div">
                            <div className="submeta-inputs">
                                <input type="text" placeholder="Titulo" ref={refTitle} required />
                                <input type="text" placeholder="Valor" ref={ref} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = Number(event.target.value.replace(/[^0-9]/g, ''))
                                    const ValorMeta = Number(valor.current?.value.replace(/[^0-9]/g, ''))
                                    if (!isNaN(value) && !isNaN(ValorMeta) && value > ValorMeta) {
                                        event.target.value = valor.current?.value || 'R$ 0'
                                    }
                                    MoneyValidation(event)
                                }} required defaultValue={valor.current?.value || 'R$ 0'}
                                />
                            </div>
                            <button className="ButtonDelete" onClick={(event) => {
                                event.preventDefault();
                                setSubMetas(SubMetas.filter((submeta) => submeta.id !== id))
                            }}><img className='icon' src="/assets/ActionsIcons/delete.svg" alt="Deletar" /></button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="button-div">
                <button type="button" onClick={() => { }} className="cancel-form-button">Cancelar</button>
                <button type="submit" className="submit-form-button">Adicionar Categoria</button>
            </div>
        </form>

    )
}