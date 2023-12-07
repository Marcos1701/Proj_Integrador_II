import { IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateMetaDto } from './create-meta.dto';
import { SubMeta } from '../sub_meta/entities/sub_meta.entity';
import { MarcoMeta } from '../marco_meta/entities/marco_meta.entity';

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
        message: "Valor inválido",
        context: {
            IsPositive: true
        }
    })
    valorAtual?: number;

    @IsOptional({
        message: "Data inválida",
        context: {
            IsDateString: true,
        }
    })
    dataLimite?: Date;

    @IsOptional({
        message: "icone inválido",
        context: {
            IsString: true,
            maxLength: 100,
            minLength: 3
        }
    })
    icone?: string;

    //submeta?: Submeta[];
    @IsOptional({
        message: "Submetas inválidas",
        context: {
            IsArray: true,
            type: [SubMeta]
        }
    })
    submeta?: SubMeta[];

    // marcos?: Marco[];

    @IsOptional({
        message: "Marcos inválidos",
        context: {
            IsArray: true,
            type: [MarcoMeta]
        }
    })
    marcos?: MarcoMeta[];

}
