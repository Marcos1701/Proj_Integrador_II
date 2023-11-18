import { PartialType } from '@nestjs/mapped-types';
import { CreateMetaDto } from './create-meta.dto';
import { IsOptional } from 'class-validator';

export class UpdateMetaDto extends PartialType(CreateMetaDto) {

    @IsOptional({
        message: "titulo inválido",
        context: {
            IsString: true,
            maxLength: 100,
            minLength: 3
        }
    })
    titulo?: string;

    @IsOptional({
        message: "Descrição inválida",
        context: {
            IsString: true,
            maxLength: 250,
            minLength: 3
        }
    })
    descricao?: string;

    @IsOptional({
        message: "Valor inválido",
        context: {
            IsPositive: true
        }
    })
    valor?: number;

    @IsOptional({
        message: "Data inválida",
        context: {
            IsDateString: true,
        }
    })
    dataLimite?: Date;

}
