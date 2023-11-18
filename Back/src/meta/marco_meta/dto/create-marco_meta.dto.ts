import { ApiProperty } from "@nestjs/swagger";
import { IsPositive, IsString, Length } from "class-validator";

export class CreateMarcoMetaDto {

    @ApiProperty({
        description: 'Título do marco',
        type: String,
        example: 'Comprar o carro'
    })
    @IsString(
        {
            message: 'Título deve ser uma string',
        }
    )
    @Length(3, 100, {
        message: 'Título deve ter entre 3 e 100 caracteres'
    })
    titulo: string;

    @ApiProperty({
        description: 'Valor do marco',
        type: Number,
        example: 100
    })
    @IsPositive({
        message: 'Valor deve ser positivo'
    })
    valor: number;
}
