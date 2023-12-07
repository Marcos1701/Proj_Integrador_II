import { useContext, useState } from "react";
import { DetailsMetaForm } from "./Components/DetailsForm";
import { Navigate, useParams } from "react-router-dom";
import { MetasContext } from "../../../../Contexts/MetasContext";

export function DetailsMetaPage() {

    const { id } = useParams()
    if (!id) {
        return <Navigate to="/" />
    }

    const { metas } = useContext(MetasContext)
    const meta = metas.find(meta => meta.id === id)
    if (!meta) return <Navigate to="/" />
    const [showDetails, setShowDetails] = useState(true)
    return (
        <main className="Page">
            {!showDetails && <Navigate to="/" />}
            <div className="Page__content">
                <div className="header-details">
                    <button type="button" className="close-button" onClick={() => setShowDetails(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
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

                    <h1>Detalhes da Meta</h1>
                </div>
                <DetailsMetaForm meta={meta} setShowDetails={setShowDetails} key={meta.id} />

            </div>
        </main>
    )
}