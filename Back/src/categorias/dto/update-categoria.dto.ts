import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-categoria.dto';
import { IsJWT, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateCategoriaDto {

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
