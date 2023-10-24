
export function FormLogin() {


    return (
        <form action="" className='form-login' >
            <label className='label-usuario' htmlFor='input-usuario' >Usuário</label>
            <input type="text" placeholder="Usuário" className='input-usuario' />

            <label className='label-senha' htmlFor='input-senha' >Senha</label>
            <input type="password" placeholder="Senha" className='input-senha' />


            <input type='checkbox' className='checkbox-lembrar' />
            <label className='label-lembrar' htmlFor='checkbox-lembrar'  >Lembrar-me</label>

            <input type="submit" value="Entrar" className='button-entrar' />
        </form >

    )
}