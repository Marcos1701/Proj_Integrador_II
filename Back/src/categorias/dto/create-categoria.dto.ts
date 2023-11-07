import { IsNotEmpty, IsPositive, IsString } from "class-validator";

export class CreateCategoriaDto {

  @IsNotEmpty(
    {
      message: "Título não informado"
    }
  )
  @IsString(
    {
      message: "Titulo inválida",
      context: {
        length: 100
      }
    }
  )
  nome: string;

  @IsString(
    {
      message: "Descrição inválida",
      context: {
        length: 250
      }
    }
  )
  descricao?: string;

  @IsPositive(
    {
      message: "Valor inválido"
    }
  )
  orcamento?: number;
}
