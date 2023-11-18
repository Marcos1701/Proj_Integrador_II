import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class CreateMetaDto {

    @ApiProperty({
        description: "Titulo da meta",
        type: String,
        maxLength: 100,
        minLength: 3,
        default: "Titulo da meta"
    })
    @IsString({
        message: "Título inválido",
        context: {
            IsString: true,
            maxLength: 100,
            minLength: 3
        }
    })
    titulo: string;


    @ApiProperty({
        description: "Descrição da meta",
        type: String,
        maxLength: 250,
        minLength: 3,
        default: "Descrição da meta"
    })
    @IsOptional({
        message: "Descrição inválida",
        context: {
            IsString: true,
            maxLength: 250,
            minLength: 3
        }
    })
    descricao?: string;

    @ApiProperty({
        description: "Valor da meta",
        type: Number,
        default: 0
    })
    @IsPositive({
        message: "Valor inválido",

    })
    @Min(0, {
        message: "Valor inválido",
        context: {
            IsPositive: true
        }
    }
    )
    valor: number;

    @ApiProperty({
        description: "Data limite da meta",
        type: Date,
        default: new Date()
    })
    @IsDateString({
        strict: true, // aceita apenas datas válidas

    }, {
        message: "Data inválida",
        context: {
            IsDateString: true,
            IsNotEmpty: true
        }
    })
    dataLimite: Date;

    @IsString({
        message: "Icone inválido",
        context: {
            IsNotEmpty: true
        }
    })
    icon: string;

    constructor(createMetaDto: Partial<CreateMetaDto>) {
        Object.assign(this, createMetaDto);
    }
}
