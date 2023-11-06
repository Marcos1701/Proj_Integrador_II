
export class CreateTransacoeDto {
  usuariotoken: string;
  tipo: 'entrada' | 'saida';
  valor: number;
  titulo: string;
  descricao?: string;
  categoriaid: string;
}
