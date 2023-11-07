import { IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateCategoriaDto {

  @IsNotEmpty(
    {
      message: "Título não informado"
    }
  )
  @IsString(
    {
      message: "Nome inválido",
      context: {
        length: 100
      }
    }
  )
  nome: string;

  @IsOptional({
    message: "descricao invélida",
    context: {
      IsString: true,
      length: 251
    }
  })
  descricao?: string;

  @IsOptional({
    message: "Orçamento inválido",
    context: {
      IsPositive: true
    }
  })
  orcamento?: number;

  @IsOptional(
    {
      message: "Ícone inválido",
      context: {
        IsString: true,
        length: 15,
        default: "barraquinha"
      }
    }
  )
  icone?: string;
}
