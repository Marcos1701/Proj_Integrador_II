import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsPositive, IsString, Min } from "class-validator";

export class CreateSubMetaDto {
    @ApiProperty({
        description: "Titulo da sub_meta",
        type: String,
        maxLength: 100,
        minLength: 3,
        default: "Titulo da sub_meta"
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
        description: "Valor da sub_meta",
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
}
