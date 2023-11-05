import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-categoria.dto';

export class UpdateCategoriaDto {
  nome?: string;
  descricao?: string;
  orcamento?: number;
  usertoken?: string;
}
