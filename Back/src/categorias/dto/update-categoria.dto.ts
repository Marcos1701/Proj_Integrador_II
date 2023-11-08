import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-categoria.dto';
import { IsJWT, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoriaDto {

  @ApiProperty({
    description: "Título da categoria",
    type: String,
    maxLength: 100,
    minLength: 3,
    default: "Categoria"
  })
  @IsOptional(
    {
      message: "Nome Inválido",
      context: {
        IsString: true,
        length: 100
      }
    }
  )
  nome?: string;

  @ApiProperty({
    description: "Descrição da categoria",
    type: String,
    maxLength: 250,
    minLength: 3,
    default: "Descrição da categoria"
  })
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

  @ApiProperty({
    description: "Orçamento da categoria",
    type: Number,
    default: 0
  })
  @IsOptional(
    {
      message: "Valor inválido",
      context: {
        IsPositive: true
      }
    }
  )
  orcamento?: number;
}
