import { useUser } from "@/utils";
import { User } from "next-auth";
import { ICategoria } from "../Categoria";
import { IMeta } from "../Meta";
import { ITransacao, Transacao } from '../Transacao';

export async function Main() {

    const user: User = await useUser();

    const [transacoes, categorias, metas]: [ITransacao[], ICategoria[], IMeta[]]
        = await Promise.all([
            await fetch(`http://localhost:3000/Transacao/${user.id}`).then(res => res.json()),
            await fetch(`http://localhost:3000/Categoria/${user.id}`).then(res => res.json()),
            await fetch(`http://localhost:3000/Meta/${user.id}`).then(res => res.json())
        ]);


    return (
        <main>

            <div className="transacoes-home">
                {
                    transacoes.map(
                        (transacao: ITransacao) => {
                            const categoria: ICategoria | undefined = categorias.find(
                                (categoria: ICategoria) => categoria.id === transacao.id_categoria
                            );

                            if (!categoria) {
                                return <p>Erro: Categoria não encontrada</p>
                            }

                            return (
                                <Transacao
                                    transacao={transacao}
                                    categoria={categoria}
                                />
                            )
                        }
                    )
                }
            </div>

        </main>
    )
}