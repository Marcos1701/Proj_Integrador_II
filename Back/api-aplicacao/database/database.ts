import * as dotenv from "dotenv";
import { Client } from "pg";
import { createClient } from '@supabase/supabase-js';
import { Database } from "./database.types";

dotenv.config({ path: ".env.local" });

const db = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
});


const inicialize = async () => {
    try {
        await db.connect().catch((err) => console.log(err));

        await db.query(`
        CREATE TABLE IF NOT EXISTS Usuario 
        ( 
        ID VARCHAR PRIMARY KEY,  
        nome VARCHAR NOT NULL,  
        Saldo FLOAT NOT NULL DEFAULT '0',  
        Email VARCHAR NOT NULL UNIQUE,
        Senha VARCHAR NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Categoria 
        ( 
        ID VARCHAR PRIMARY KEY,
        ID_Usuario VARCHAR NOT NULL,
        Nome VARCHAR NOT NULL,  
        descricao VARCHAR,  
        CONSTRAINT fk_usuario
            FOREIGN KEY (ID_Usuario)
                REFERENCES Usuario(ID) 
        );

        CREATE TABLE IF NOT EXISTS Orcamento 
        ( 
        ID VARCHAR PRIMARY KEY,
        ID_Usuario VARCHAR NOT NULL,
        ID_Categoria VARCHAR NOT NULL,  
        Limite FLOAT NOT NULL,
        CONSTRAINT fk_usuario
            FOREIGN KEY (ID_Usuario)
                REFERENCES Usuario(ID),
        CONSTRAINT fk_categoria
            FOREIGN KEY (ID_Categoria)
                REFERENCES Categoria(ID)  
        );

        CREATE TABLE IF NOT EXISTS Transacao 
        ( 
        ID VARCHAR PRIMARY KEY,
        ID_Usuario VARCHAR NOT NULL,
        ID_Categoria VARCHAR NOT NULL,
        tipo VARCHAR NOT NULL,
        valor FLOAT NOT NULL,  
        titulo VARCHAR NOT NULL,  
        descricao VARCHAR,  
        data DATE NOT NULL,
        CONSTRAINT fk_usuario
            FOREIGN KEY (ID_Usuario)
                REFERENCES Usuario(ID),
        CONSTRAINT fk_categoria
            FOREIGN KEY (ID_Categoria)
                REFERENCES Categoria(ID)
        );  

        CREATE TABLE IF NOT EXISTS Meta 
        ( 
        ID VARCHAR PRIMARY KEY,  
        ID_Usuario VARCHAR NOT NULL,
        Valor_Desejado FLOAT NOT NULL,  
        DataFinal DATE DEFAULT NULL,
        progresso INT NOT NULL DEFAULT '0',  
        Valor_Obtido FLOAT NOT NULL DEFAULT '0',  
        CONSTRAINT fk_usuario
            FOREIGN KEY (ID_Usuario)
	            REFERENCES Usuario(ID)
        );

        CREATE TABLE IF NOT EXISTS Marco
        ( 
        ID VARCHAR PRIMARY KEY,
        ID_META VARCHAR NOT NULL,
        Data DATE NOT NULL,  
        Valor_Obtido FLOAT NOT NULL,
        CONSTRAINT fk_meta
            FOREIGN KEY (ID_Meta)
                REFERENCES Meta(ID)
        );

        CREATE TABLE IF NOT EXISTS subMeta
        ( 
        ID INT PRIMARY KEY,
        ID_Meta VARCHAR NOT NULL,
        nome VARCHAR NOT NULL,  
        descricao VARCHAR,  
        Valor_Desejavel FLOAT NOT NULL,  
        Valor_Obtido FLOAT NOT NULL DEFAULT '0',
        CONSTRAINT fk_meta
            FOREIGN KEY (ID_Meta)
                REFERENCES Meta(ID)  
        );  
    `);

    } catch (err) {
        console.log(err);
    }
    console.log("Database inicialized");
    return;
}

// essa é a forma básica de conectar com o banco de dados
// as queries são feitas com db.query('query')
// exemplo: db.query('SELECT * FROM usuario')
// o retorno é um objeto com os dados da query
// exemplo: { rows: [ { id: 'id do usuário', nome: 'nome do usuário', ... } ] }

inicialize();

export default db;


// via typeORM + Supabase

const supabase = createClient<Database>(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// exemplo de uso
const getUsers = async () => {
    const { data, error } = await supabase
        .from('usuario')
        .select('*');

    // data é um array de objetos
    // cada objeto é um usuário do banco de dados, já com a tipagem correta
    // exemplo: data[0].nome

    if (error) {
        throw new Error(error.message);
    }

    console.log(data);
}

interface User {
    id: string;
    nome: string;
    email: string;
    senha: string;
}

const insertUser = async (user: User): Promise<User> => {
    const { error } = await supabase
        .from('usuario')
        .insert([
            {
                id: user.id,
                nome: user.nome,
                email: user.email,
                senha: user.senha
            }
        ]);
    // o metodo insert é o mesmo que o insert normal, ele recebe um array de objetos
    // e cada objeto é um usuário a ser inserido no banco de dados
    // outros métodos: update, delete, select
    // exemplo de uso: supabase.from('usuario').update({ nome: 'novo nome' }).match({ id: 'id do usuário' })
    // exemplo de uso: supabase.from('usuario').delete().match({ id: 'id do usuário' })
    // match é o where do SQL, mas possuem outros métodos, como o like, por exemplo
    // exemplo de uso: supabase.from('usuario').select('*').like('nome', 'nome do usuário')
    // ou o ilike, que é o like case insensitive
    // exemplo de uso: supabase.from('usuario').select('*').ilike('nome', 'nome do usuário')

    if (error) {
        throw new Error(error.message);
    }

    return user;
}

export { supabase, getUsers, insertUser }