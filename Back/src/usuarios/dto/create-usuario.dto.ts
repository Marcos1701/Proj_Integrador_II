import { ApiProperty } from "@nestjs/swagger";

export class CreateUsuarioDto {
  @ApiProperty(
    {
      type: String,
      description: "Nome do usuário",
      required: true,
      default: "Fulano",
    },
  )
  nome: string;

  @ApiProperty(
    {
      type: String,
      description: "Email do usuário",
      required: true,
      default: "AiiinnnzedaManga123@gmail.com",
    },
  )
  email: string;

  @ApiProperty(
    {
      type: String,
      description: "Senha do usuário",
      required: true,
      default: "123456789",
    },
  )
  senha: string;

  @ApiProperty(
    {
      type: String,
      description: "Token do usuário",
      required: true
    },
  )
  access_token: string;
}
