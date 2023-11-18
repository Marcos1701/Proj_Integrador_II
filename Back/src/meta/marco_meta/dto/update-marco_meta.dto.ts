import { PartialType } from '@nestjs/mapped-types';
import { CreateMarcoMetaDto } from './create-marco_meta.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, IsPositive } from 'class-validator';

export class UpdateMarcoMetaDto extends PartialType(CreateMarcoMetaDto) {
    @ApiProperty({
        description: 'Título do marco',
        type: String,
        example: 'Comprar o carro',
        nullable: true
    })
    @IsOptional({
        message: 'Título deve ser uma string',
    })
    @IsString(
        {
            message: 'Título deve ser uma string',
        }
    )
    @Length(3, 100, {
        message: 'Título deve ter entre 3 e 100 caracteres'
    })
    titulo?: string;

    @ApiProperty({
        description: 'Valor do marco',
        type: Number,
        example: 100,
        nullable: true
    })
    @IsOptional({
        message: 'Valor deve ser positivo'
    })
    @IsPositive({
        message: 'Valor deve ser positivo'
    })
    valor: number;
}
