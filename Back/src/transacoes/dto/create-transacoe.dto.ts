import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsEnum, IsJWT, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateTransacoeDto {

  @ApiProperty({
    description: "Tipo da transação",
    type: String,
    enum: ['entrada', 'saida'],
    default: "entrada"
  })
  @IsEnum(
    {
      E: 'entrada',
      S: 'saida'
    },
    {
      message: "Tipo inválido"
    }
  )
  tipo: 'entrada' | 'saida';

  @ApiProperty({
    description: "Valor da transação",
    type: Number,
    default: 0
  })
  @IsPositive(
    {
      message: "Valor inválido"
    }
  )
  valor: number;

  @ApiProperty({
    description: "Titulo da transação",
    type: String,
    maxLength: 100,
    minLength: 3,
    default: "Titulo da transação"
  })
  @IsNotEmpty(
    {
      message: "Título não informado"
    }
  )
  titulo: string;

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
    description: "Data da transação",
    type: Date,
    default: new Date()
  })
  @IsDateString(
    {
      strict: true, // aceita apenas datas válidas

    }, {
    message: "Data inválida",
    context: {
      IsDateString: true
    }
  }
  )
  data: Date;

  @ApiProperty({
    description: "ID da categoria",
    type: String,
    default: "00000000-0000-0000-0000-000000000000"
  })
  @IsUUID("all", {
    message: "ID da categoria inválido",
    each: true, // valida cada id do array
    context: {
      IsUUID: true
    }
  })
  categoriaid: string;
}
