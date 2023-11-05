import { PartialType } from '@nestjs/mapped-types';
import { CreateTransacoeDto } from './create-transacoe.dto';

export class UpdateTransacoeDto extends PartialType(CreateTransacoeDto) {
    usuariotoken: string;
    tipo?: 'entrada' | 'saida';
    valor?: number;
    titulo?: string;
    descricao?: string;
    categoriaid?: string;
}
