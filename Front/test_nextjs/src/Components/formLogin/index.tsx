import { Inter } from "next/font/google"

export function FormLogin() {

    const inter = Inter({ subsets: ['latin'] })
    

    return (
        <>
            <h1 className='title-login'>Login</h1>
            <h2 className='subtitle-login'>Faça seu login</h2>
            
            <label className='label-usuario' htmlFor='input-usuario' >Usuário</label>
            <input type="text" placeholder="Usuário" className='input-usuario' />

            <label className='label-senha' htmlFor='input-senha' >Senha</label>
            <input type="password" placeholder="Senha" className='input-senha' />


            <input type='checkbox' className='checkbox-lembrar' />
            <label className='label-lembrar' htmlFor='checkbox-lembrar'  >Lembrar-me</label>

            <button className='button-entrar' >Entrar</button>
        </>
    )
}