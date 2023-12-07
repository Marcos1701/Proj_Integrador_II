
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { api_url, useAuth } from "../../../../Contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { MoneyValidation } from "../../../Home/Components/Form/AdicionarTransacaoForm";
import '../Details.css'
import './MetaDetail.css'
import { IconSelect } from "../../../Home/Components/Form/AdicionarCategoriaForm/Components/IconSelect";
import { MetasContext } from "../../../../Contexts/MetasContext";
import isDate from 'validator/lib/isDate';
import { IMeta } from "../../../List/ListMetasV2/Components/Meta";
import { ulid } from "ulidx";


interface IProps {
    meta: IMeta
    setShowDetails: React.Dispatch<React.SetStateAction<boolean>>
    setMeta: React.Dispatch<React.SetStateAction<IMeta | undefined>>
}

export function DetailsMetaPage(
    {
        meta,
        setShowDetails,
        setMeta
    }: IProps
) {
    if (!meta) return <Navigate to="/404" />

    const tituloRef = useRef<HTMLInputElement>(null)
    const descricaoRef = useRef<HTMLTextAreaElement>(null);
    const ValorDesejadoRef = useRef<HTMLInputElement>(null)
    const data = useRef<HTMLInputElement>(null);
    const [icone, setIcone] = useState<string>(meta.icon ? meta.icon : 'barraquinha');

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const { user } = useAuth()
    if (!user) return <Navigate to="/login" />


    const { setUpdated } = useContext(MetasContext)
    const ValidateValues = () => {

        if ((!tituloRef.current || !descricaoRef.current || !ValorDesejadoRef.current || !data.current
        )
            || (tituloRef.current.value === meta.titulo && descricaoRef.current.value === meta.descricao && ValorDesejadoRef.current.value.split(' ')[1] === "0" && data.current.value === meta.dataLimite.toISOString().split('T')[0])
        ) {
            return false
        }

        return true;
    }
    const [ableToSubmit, setAbleToSubmit] = useState(false);

    // guardar submetas em um array
    const [SubMetas, setSubMetas] = useState<{
        id: string,
        refTitle: React.RefObject<HTMLInputElement>,
        titulo?: string,
        ref: React.RefObject<HTMLInputElement>,
        valor?: number
    }[]>(
        meta.subMetas?.map((submeta) => ({
            id: submeta.id,
            refTitle: React.createRef(),
            titulo: submeta.titulo,
            ref: React.createRef(),
            valor: submeta.valor
        })) || []
    );

    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!tituloRef.current || !descricaoRef.current || !ValorDesejadoRef.current || !data.current) return


        if (!ValidateValues()) {
            setError('Nenhuma alteração foi feita')
            return
        }

        const nome = tituloRef.current.value
        const descricao = descricaoRef.current.value === '' ? 'Sem descrição' : descricaoRef.current.value
        const valorDesejado = parseFloat(ValorDesejadoRef.current.value.split(' ')[1])
        const dataFinal = data.current.value

        let values: {
            nome?: string;
            descricao?: string;
            valorDesejado?: number;
            icone?: string;
            dataFinal?: string;
            submeta?: {
                id?: string,
                titulo?: string | null,
                valor?: number | null
            }[] | null,
            marcos?: {
                id?: string,
                data?: string | null,
                valor?: number | null
            }[]
        } = {}

        if (nome !== meta.titulo && nome.length > 0) values.nome = nome;
        if (descricao !== meta.descricao && descricao.length > 0) values.descricao = descricao;
        if (valorDesejado !== meta.valor && valorDesejado > 0) values.valorDesejado = valorDesejado;
        if (dataFinal !== meta.dataLimite.toISOString().split('T')[0] && isDate(dataFinal, { format: 'YYYY-MM-DD', delimiters: ['-'] })) values.dataFinal = dataFinal;

        if (icone !== meta.icon) {
            values = {
                ...values,
                icone
            }
        }

        if (SubMetas.length > 0) {
            values = {
                ...values,
                submeta: SubMetas.map(({ id, ref, refTitle }) => ({
                    id,
                    titulo: refTitle.current?.value ? refTitle.current.value : null,
                    valor: ref.current?.value ? Number(ref.current.value.replace(/[^0-9]/g, '')) : null
                })).filter(({ titulo, valor }) => titulo && valor) // remove submetas sem titulo ou valor
            }
        }

        if (values.submeta && values.submeta.length === 0) {
            values.submeta = null
        }

        const response = await axios.patch(`${api_url}categorias/${meta.id}`, values, {
            headers: {
                getAuthorization: true,
                Authorization: user.access_token
            }
        })

        if (response.status !== 200 && response.status !== 201) {
            setError(response.statusText)
            return;
        }
        setError('')
        setSuccess('Categoria atualizada com sucesso')
        setUpdated(true);

        setTimeout(() => {
            setShowDetails && setShowDetails(false)
            setMeta && setMeta(undefined)
        }, 1000)
    }

    const HandleDelete = async () => {
        const response = await axios.delete(`${api_url}meta/${meta.id}`, {
            headers: {
                Authorization: user.access_token
            }
        }).then((response) => {
            if (response.status === 204) {
                setUpdated(true)
            }
            return response
        })
        if (response.status !== 204) alert('Erro ao deletar meta');
    }

    const handleDeleteSubMeta = async (id: string) => {
        const submeta = meta.subMetas?.find(
            (submeta) => submeta.id === id
        )

        if (submeta) {
            const response = await axios.delete(`${api_url}meta/${meta.id}/sub-meta/${id}`)
            if (response.status !== 204) {
                console.log("submeta removida..")
            }
        }

    }

    const handleAddSubMeta = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        setSubMetas(oldSubMetas => [...oldSubMetas, { id: ulid(), ref: React.createRef(), refTitle: React.createRef() }]);
    }

    useEffect(() => {
        setAbleToSubmit(ValidateValues())
    }, [tituloRef.current?.value, descricaoRef.current?.value, ValorDesejadoRef.current?.value, data.current?.value, icone])


    return (
        <div className="Background-blur" id="background-form" >
            <div className="details-div" id="detais-div-meta"
            // onMouseLeave={(e) => {
            //     if (e.target === e.currentTarget) {
            //         setMeta(undefined)
            //         setShowDetails(false)
            //     }
            // }}
            >
                <div className="header-details">
                    <button type="button" className="close-button" onClick={() => setShowDetails(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                            <g clipPath="url(#clip0_206_145)">
                                <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" fill="black" />
                            </g>
                            <defs>
                                <clipPath id="clip0_206_145">
                                    <rect width="24" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                    <h2>Detalhes da Meta</h2>
                </div>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <form className="element-details" onSubmit={handleUpdate}>

                    <div className="values-group">
                        <div className="meta-info" id="details-meta">
                            <div className="input-div" id="title_meta_div">
                                <label htmlFor="Titulo">Titulo</label>
                                <input type="text" name="Titulo" id="Titulo"
                                    ref={tituloRef}
                                    placeholder="Titulo da Meta"
                                    className="input-nome"
                                    defaultValue={meta.titulo}
                                    onChange={e => {
                                        if (e.target.value === '') e.target.value = meta.titulo;
                                        if (e.target.value.length > 100) return;

                                        setAbleToSubmit(ValidateValues())
                                    }} />
                            </div>
                            <div className="select-orcamento-group" id="valor_data_div">
                                <div className="input-valor" id="Valor-div">
                                    <label htmlFor="Valor" className="label-valor">Valor Desejado</label>
                                    <input type="text" name="Valor"
                                        ref={ValorDesejadoRef}
                                        id="input-Valor"
                                        defaultValue={`R$ ${meta.valor}`}
                                        onChange={(e) => {
                                            MoneyValidation(e)
                                            setAbleToSubmit(ValidateValues())
                                        }} />
                                </div>

                                <div className="input-div">
                                    <label htmlFor="data">Data Limite</label>
                                    <input type="date" placeholder="Data" ref={data} className="input-data" name="data"
                                        required // para aceitar apenas datas posteriores ou iguais à data atual
                                        min={new Date().toISOString().split('T')[0]}
                                        // initial value
                                        defaultValue={meta.dataLimite.toISOString().split('T')[0]}
                                        disabled={meta.dataLimite < new Date()}
                                        onChange={e => {
                                            if (e.target.value === '') return;
                                            setAbleToSubmit(ValidateValues())
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="input-valor" id="ValorAtual">
                                <label htmlFor="Valor" className="label-valor">Valor Atual</label>
                                <input type="text" name="Valor"
                                    id="input-Valor"
                                    defaultValue={`R$ ${meta.valorAtual}`}
                                    onChange={(e) => {
                                        // verificar se o valor atual é maior que o valor desejado ou se é negativo
                                        MoneyValidation(e)
                                        const value = Number(e.target.value.replace(/[^0-9]/g, ''))
                                        const ValorDesejado = Number(ValorDesejadoRef.current?.value.replace(/[^0-9]/g, ''))

                                        if (!isNaN(value) && !isNaN(ValorDesejado) && value > ValorDesejado) {
                                            e.target.value = ValorDesejadoRef.current?.value || 'R$ 0'
                                        }
                                        setAbleToSubmit(ValidateValues())
                                    }
                                    }
                                />

                            </div>

                            <IconSelect setIcone={setIcone} valueDefault={icone} onChange={
                                () => setAbleToSubmit(ValidateValues())
                            }
                            />

                            <div className="label-element-div" id="desc_meta_div">
                                <label htmlFor="descricao">Descrição</label>
                                <textarea name="descricao" id="descricao"
                                    ref={descricaoRef}
                                    placeholder="Descrição da Meta"
                                    defaultValue={meta.descricao}
                                    className="input-descricao"
                                    onChange={e => {
                                        if (e.target.value.length > 250) return;
                                        setAbleToSubmit(ValidateValues())
                                    }} />
                            </div>


                            <div className="label-element-div" id="submetasDiv">
                                <div className="label-element-div" id="submetaslabelDiv">
                                    <label htmlFor="add-submeta">Submetas</label>
                                    <a href="#" onClick={handleAddSubMeta} className="add-submeta">Adicionar submeta</a>
                                </div>
                                <div className="submeta-div">
                                    {SubMetas.map(({ id, ref, refTitle, titulo, valor }) => (
                                        <div key={id} className="submeta-input-div">
                                            <div className="submeta-inputs">
                                                <input type="text" placeholder="Titulo" ref={refTitle} required defaultValue={titulo ? titulo : ''}
                                                />
                                                <input type="text" placeholder="Valor" ref={ref} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    const value = Number(event.target.value.replace(/[^0-9]/g, ''))
                                                    const ValorMeta = Number(ValorDesejadoRef.current?.value.replace(/[^0-9]/g, ''))
                                                    if (!isNaN(value) && !isNaN(ValorMeta) && value > ValorMeta) {
                                                        event.target.value = ValorDesejadoRef.current?.value || 'R$ 0'
                                                    }
                                                    MoneyValidation(event)
                                                }} required defaultValue={valor ? `R$ ${valor}` : ValorDesejadoRef.current?.value || 'R$ 0'}
                                                />
                                            </div>
                                            <button className="ButtonDelete" onClick={(event) => {
                                                event.preventDefault();
                                                handleDeleteSubMeta(id)
                                                setSubMetas(SubMetas.filter((submeta) => submeta.id !== id))
                                            }}><img className='icon' src="/assets/ActionsIcons/delete.svg" alt="Deletar" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="button-div">
                        <button className="submit-form-button" type="submit" disabled={ableToSubmit}>Salvar</button>
                        <button type="button" className="delete-value-form" onClick={HandleDelete}>Deletar</button>
                    </div>

                </form>
            </div >

        </div >
    )
}