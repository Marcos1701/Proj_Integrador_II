import { PartialType } from '@nestjs/mapped-types';
import { CreateTransacoeDto } from './create-transacoe.dto';
import { IsAlphanumeric, IsEnum, IsJWT, IsPositive, IsString, IsUUID } from 'class-validator';

export class UpdateTransacoeDto extends PartialType(CreateTransacoeDto) {

    @IsEnum(
        {
            E: 'entrada',
            S: 'saida'
        },
        {
            message: "Tipo inválido",
        }
    )
    tipo?: 'entrada' | 'saida';

    @IsPositive(
        {
            message: "Valor inválido"
        }
    )
    valor?: number;

    @IsString(
        {
            message: "Título inválido",
            context: {
                length: 100
            }
        }
    )
    titulo?: string;
    descricao?: string;

    @IsUUID("all", {
        message: "ID da categoria inválido"
    })
    categoriaid?: string;
}
