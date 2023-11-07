import { IsEnum, IsJWT, IsNotEmpty, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateTransacoeDto {

  @IsJWT(
    {
      message: "Token inválido"
    }
  )
  access_token: string;

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

  @IsString(
    {
      message: "Descrição inválida",
      context: {
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
