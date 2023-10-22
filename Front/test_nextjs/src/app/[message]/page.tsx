'use client'
import { useParams } from "next/navigation"

export default function MessageText() {
    const { message } = useParams()

    return (
        <main>
            <h1>Message</h1>
            {message && <p>{message}</p>}
        </main>
    )
}