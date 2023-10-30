import { ListTransacoes } from "../ListTransacoes";
import { ListCategorias } from "../ListCategorias";
import { ListMetas } from "../ListMetas";
import { SecaoActions_Home } from "./Components/SecaoAcoes";

/* 
O módulo 'SecaoActions_Home' não pode ser usado como um componente JSX.
  Its type '() => Promise<Element>' is not a valid JSX element type.
    O tipo '() => Promise<Element>' não pode ser atribuído ao tipo '(props: any, deprecatedLegacyContext?: any) => ReactNode'.
      O tipo 'Promise<Element>' não pode ser atribuído ao tipo 'ReactNode'.

      // para resolver esse problema, basta adicionar o 'await' na frente da função 'SecaoActions_Home'
        // ou seja, 'await SecaoActions_Home'

*/

export function Home() {
  return (
    <main>
      <SecaoActions_Home />
      <h2>Transações</h2>
      <ListTransacoes />
      <h2>Categorias</h2>
      <ListCategorias />
      <h2>Metas</h2>
      <ListMetas />
    </main>
  )
}