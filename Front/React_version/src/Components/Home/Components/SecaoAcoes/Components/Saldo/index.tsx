import { ITransacao } from "../../../../../Transacao";
import { useUser } from "../../../../../EncapsulatedContext";
import { Suspense, useEffect, useState } from "react";
import { User } from "../../../../../../Contexts/AuthContext";
import axios from "axios";


export function Saldo() {
    const [user, setUser] = useState<User>();
    const [saldo, setSaldo] = useState<number>(0);

    useEffect(() => {
        async function getUser() {
            const user: User = await useUser();
            setUser(user);
        }
        getUser();
        async function getSaldo() {
            if (!user) return 0;
            const saldo: number = (await axios.get<ITransacao[]>(`http://localhost:3300/Transacao?id_usuario=${user.id}`)).data.reduce((acc: number, transacao: ITransacao) => {
                if (transacao.tipo === 'Entrada') {
                    return acc + transacao.Valor
                }
                return acc - transacao.Valor
            }, 0)
            setSaldo(saldo);
        }
        getSaldo();
    }, []);

    // o saldo é a soma de todas as transações

    return (
        <Suspense fallback={
            <div className="saldo-home-skeleton">
            </div>
        }>
            <div className="saldo-home">
                <div className="Saldo-icon">
                    <img src="/icons/saldo.svg" alt="saldo" />
                </div>

                <div className="saldo-info">
                    <h3>Saldo</h3>
                    <span>{saldo}</span>
                </div>
            </div>
        </Suspense>
    )
}