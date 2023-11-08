import { PartialType } from '@nestjs/mapped-types';
import { CreateTransacoeDto } from './create-transacoe.dto';
import { IsEnum, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransacoeDto extends PartialType(CreateTransacoeDto) {

    @ApiProperty({
        description: "Tipo da transação",
        type: String,
        enum: ['entrada', 'saida'],
        default: "entrada"
    })
    @IsOptional(
        {
            message: "Tipo inválido",
            context: {
                enum: ['entrada', 'saida']
            }
        }
    )
    tipo?: 'entrada' | 'saida';

    @ApiProperty({
        description: "Valor da transação",
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
    valor?: number;

    @ApiProperty({
        description: "Titulo da transação",
        type: String,
        maxLength: 100,
        minLength: 3,
        default: "Titulo da transação"
    })
    @IsOptional(
        {
            message: "Título inválido",
            context: {
                IsString: true,
                length: 100
            }
        }
    )
    titulo?: string;

    @ApiProperty({
        description: "Descrição da transação",
        type: String,
        maxLength: 250,
        minLength: 3,
        default: "Descrição da transação"
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
        description: "ID da categoria",
        type: String,
        default: "00000000-0000-0000-0000-000000000000"
    })
    @IsOptional({
        message: "ID da categoria inválido",
        context: {
            IsUUID: true,
            version: 'all'
        }
    })
    categoriaid?: string;
}
