import { IsEnum, IsJWT, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateTransacoeDto {

  @IsEnum(
    {
      E: 'entrada',
      S: 'saida'
    },
    {
      message: "Tipo inválido"
    }
  )
  tipo: 'entrada' | 'saida';

  @IsPositive(
    {
      message: "Valor inválido"
    }
  )
  valor: number;

  @IsNotEmpty(
    {
      message: "Título não informado"
    }
  )
  titulo: string;

  @IsOptional(
    {
      message: "Descrição inválida",
      context: {
        IsString: true,
        length: 250
      }
    }
  )
  descricao?: string;

  @IsUUID("all", {
    message: "ID da categoria inválido"
  })
  categoriaid: string;
}
