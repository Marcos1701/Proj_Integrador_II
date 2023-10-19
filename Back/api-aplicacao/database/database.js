"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertUser = exports.getUsers = exports.supabase = void 0;
var dotenv = require("dotenv");
var pg_1 = require("pg");
var supabase_js_1 = require("@supabase/supabase-js");
dotenv.config({ path: "../.env.local" });
console.log(process.env.DB_HOST);
var db = new pg_1.Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
});
var inicialize = function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, db.connect().catch(function (err) { return console.log(err); })];
            case 1:
                _a.sent();
                return [4 /*yield*/, db.query("\n        CREATE TABLE IF NOT EXISTS Usuario \n        ( \n        ID VARCHAR PRIMARY KEY,  \n        nome VARCHAR NOT NULL,  \n        Saldo FLOAT NOT NULL DEFAULT '0',  \n        Email VARCHAR NOT NULL UNIQUE,\n        Senha VARCHAR NOT NULL\n        );\n\n        CREATE TABLE IF NOT EXISTS Categoria \n        ( \n        ID VARCHAR PRIMARY KEY,\n        ID_Usuario VARCHAR NOT NULL,\n        Nome VARCHAR NOT NULL,  \n        descricao VARCHAR,  \n        CONSTRAINT fk_usuario\n            FOREIGN KEY (ID_Usuario)\n                REFERENCES Usuario(ID) \n        );\n\n        CREATE TABLE IF NOT EXISTS Orcamento \n        ( \n        ID VARCHAR PRIMARY KEY,\n        ID_Usuario VARCHAR NOT NULL,\n        ID_Categoria VARCHAR NOT NULL,  \n        Limite FLOAT NOT NULL,\n        CONSTRAINT fk_usuario\n            FOREIGN KEY (ID_Usuario)\n                REFERENCES Usuario(ID),\n        CONSTRAINT fk_categoria\n            FOREIGN KEY (ID_Categoria)\n                REFERENCES Categoria(ID)  \n        );\n\n        CREATE TABLE IF NOT EXISTS Transacao \n        ( \n        ID VARCHAR PRIMARY KEY,\n        ID_Usuario VARCHAR NOT NULL,\n        ID_Categoria VARCHAR NOT NULL,\n        tipo VARCHAR NOT NULL,\n        valor FLOAT NOT NULL,  \n        titulo VARCHAR NOT NULL,  \n        descricao VARCHAR,  \n        data DATE NOT NULL,\n        CONSTRAINT fk_usuario\n            FOREIGN KEY (ID_Usuario)\n                REFERENCES Usuario(ID),\n        CONSTRAINT fk_categoria\n            FOREIGN KEY (ID_Categoria)\n                REFERENCES Categoria(ID)\n        );  \n\n        CREATE TABLE IF NOT EXISTS Meta \n        ( \n        ID VARCHAR PRIMARY KEY,  \n        ID_Usuario VARCHAR NOT NULL,\n        Valor_Desejado FLOAT NOT NULL,  \n        DataFinal DATE DEFAULT NULL,\n        progresso INT NOT NULL DEFAULT '0',  \n        Valor_Obtido FLOAT NOT NULL DEFAULT '0',  \n        CONSTRAINT fk_usuario\n            FOREIGN KEY (ID_Usuario)\n\t            REFERENCES Usuario(ID)\n        );\n\n        CREATE TABLE IF NOT EXISTS Marco\n        ( \n        ID VARCHAR PRIMARY KEY,\n        ID_META VARCHAR NOT NULL,\n        Data DATE NOT NULL,  \n        Valor_Obtido FLOAT NOT NULL,\n        CONSTRAINT fk_meta\n            FOREIGN KEY (ID_Meta)\n                REFERENCES Meta(ID)\n        );\n\n        CREATE TABLE IF NOT EXISTS subMeta\n        ( \n        ID INT PRIMARY KEY,\n        ID_Meta VARCHAR NOT NULL,\n        nome VARCHAR NOT NULL,  \n        descricao VARCHAR,  \n        Valor_Desejavel FLOAT NOT NULL,  \n        Valor_Obtido FLOAT NOT NULL DEFAULT '0',\n        CONSTRAINT fk_meta\n            FOREIGN KEY (ID_Meta)\n                REFERENCES Meta(ID)  \n        );  \n    ")];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 4];
            case 4:
                console.log("Database inicialized");
                return [2 /*return*/];
        }
    });
}); };
// essa é a forma básica de conectar com o banco de dados
// as queries são feitas com db.query('query')
// exemplo: db.query('SELECT * FROM usuario')
// o retorno é um objeto com os dados da query
// exemplo: { rows: [ { id: 'id do usuário', nome: 'nome do usuário', ... } ] }
inicialize();
exports.default = db;
// via typeORM + Supabase
// para gerar a tipagem do banco de dados, é necessário instalar o supabase cli e rodar o comando
// supabase gen types typescript --project-id tpjjacgapstyjpzkibag > database.types.ts
// o arquivo gerado deve ser colocado na pasta database
// quanto as migrations, basta rodar o comando
// supabase migrate up --project-id tpjjacgapstyjpzkibag
// e para trazer as migrations para o projeto, basta rodar o comando
// supabase migrate save --project-id tpjjacgapstyjpzkibag
var supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
exports.supabase = supabase;
// exemplo de uso
var getUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, data, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, supabase
                    .from('usuario')
                    .select('*')];
            case 1:
                _a = _b.sent(), data = _a.data, error = _a.error;
                // data é um array de objetos
                // cada objeto é um usuário do banco de dados, já com a tipagem correta
                // exemplo: data[0].nome
                if (error) {
                    throw new Error(error.message);
                }
                console.log(data);
                return [2 /*return*/];
        }
    });
}); };
exports.getUsers = getUsers;
var insertUser = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var error;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, supabase
                    .from('usuario')
                    .insert([
                    {
                        id: user.id,
                        nome: user.nome,
                        email: user.email,
                        senha: user.senha
                    }
                ])];
            case 1:
                error = (_a.sent()).error;
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
                return [2 /*return*/, user];
        }
    });
}); };
exports.insertUser = insertUser;
