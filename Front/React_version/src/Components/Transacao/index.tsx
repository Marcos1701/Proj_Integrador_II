import { ICategoria } from "../Categoria";
import { realizarTratamentoValor } from "../Home/Components/SecaoAcoes/Components/Saldo";
import './Transacao.css'

export interface ITransacao {
    id: string;
    tipo: 'entrada' | 'saida';
    valor: number;
    titulo: string;
    descricao?: string;
    dataCriacao: Date;
    categoriaid: string;
}

export interface ITransacaoProps {
    transacao: ITransacao;
    categoria: ICategoria;
}

export function Transacao({ transacao, categoria }: ITransacaoProps) {

    const tratarData = (data: Date) => { // tratar para o estilo => 22 Setembro 2023
        const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        const dataSplit = data.toString().split('-')
        const dia = dataSplit[2].split('T')[0]
        const mes = meses[parseInt(dataSplit[1]) - 1]
        const ano = dataSplit[0]
        return `${dia} ${mes} ${ano}`
    }

    return (
        <div className="transacao" id={transacao.id}>
            <div className="transacao-icon">
                <img src={
                    categoria.icone ?
                        `/assets/icons/${categoria.icone}.svg` :
                        "/assets/icons/barraquinha.svg"
                } alt={categoria.nome} className='icon'/>
            </div>
            <div className="transacao-info">
                <div className="line" id="line1">
                    <p id="nome-transacao">{transacao.titulo}</p>
                    <p className={"valor-transacao-" + transacao.tipo}>R$ {realizarTratamentoValor(transacao.valor)}</p>
                </div>

                <div className="line" id="line2">
                    <p id="nome-categoria">{categoria.nome}</p>
                    <p id="data-transacao">{tratarData(transacao.dataCriacao)}</p>
                </div>
            </div>
        </div>
    )
}