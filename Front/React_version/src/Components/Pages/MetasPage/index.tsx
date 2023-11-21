import { useState } from "react";
import { Navigate } from "react-router-dom";
import { ListaMetas } from "../../List/ListMetasV2";
import { IMeta } from "../../List/ListMetas/Components/Meta";
import { DetailsMetaPage } from "../DetailsPage/Meta";


export function MetasPage() {

    const [showDetails, setShowDetails] = useState<boolean>(false);
    const [voltar, setVoltar] = useState<boolean>(false);
    const [meta, setMeta] = useState<IMeta | undefined>();
    return (
        <main className="page">
            {voltar && <Navigate to={'/'} />}
            <div className="page-header">
                <button onClick={() => { setVoltar(!voltar) }}
                    className="back-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none">
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

                <h2 className="title">Metas</h2>
            </div>

            {showDetails && meta !== undefined && <DetailsMetaPage setShowDetails={setShowDetails} meta={meta} setMeta={setMeta} />}
            <ListaMetas page={1} limit={6} classname="list_on_page" setShowDetails={setShowDetails} setMeta={setMeta} />
        </main>
    )
}