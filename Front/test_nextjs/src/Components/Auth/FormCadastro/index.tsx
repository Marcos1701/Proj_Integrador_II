

export function FormCadastro() {


    return (
        <form action="" className='form-cadastro' >
            <label className='label-usuario' htmlFor='input-Nome' >Nome</label>
            <input type="text" placeholder="Digite seu nome" className='input-Nome' />

            <label className='label-usuario' htmlFor='input-email' >Email</label>
            <input type="text" placeholder="Email" className='input-email' />

            <label className='label-senha' htmlFor='input-senha' >Senha</label>
            <input type="password" placeholder="Senha" className='input-senha' />


            <input type='checkbox' className='checkbox-lembrar' />
            <label className='label-lembrar' htmlFor='checkbox-lembrar'  >Lembrar-me</label>

            <input type="submit" value="Cadastrar" className='button-Cadastrar' />
        </form>
    )
}