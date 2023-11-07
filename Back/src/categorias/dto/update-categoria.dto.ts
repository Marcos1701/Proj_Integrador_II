import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-categoria.dto';
import { IsJWT, IsPositive, IsString } from 'class-validator';

export class UpdateCategoriaDto {

  @IsString(
    {
      message: "Titulo inválida",
      context: {
        length: 100
      }
    }
  )
  nome?: string;

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

  @IsJWT(
    {
      message: "Token inválido"
    }
  )
  usertoken: string;
}
