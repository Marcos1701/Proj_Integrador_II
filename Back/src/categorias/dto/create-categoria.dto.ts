import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateCategoriaDto {

  @ApiProperty({
    description: "Título da categoria",
    type: String,
    maxLength: 100,
    minLength: 3,
    default: "Categoria"
  })
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

  @ApiProperty({
    description: "Descrição da categoria",
    type: String,
    maxLength: 250,
    minLength: 3,
    default: "Descrição da categoria"
  })
  @IsOptional({
    message: "descricao invélida",
    context: {
      IsString: true,
      length: 251
    }
  })
  descricao?: string;

  @ApiProperty({
    description: "Orçamento da categoria",
    type: Number,
    default: 0
  })
  @IsOptional({
    message: "Orçamento inválido",
    context: {
      IsPositive: true
    }
  })
  orcamento?: number;

  @ApiProperty({
    description: "Ícone da categoria",
    type: String,
    maxLength: 15,
    minLength: 3,
    default: "barraquinha"
  })
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
