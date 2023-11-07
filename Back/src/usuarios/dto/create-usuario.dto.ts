import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsStrongPassword } from "class-validator";

export class CreateUsuarioDto {
  @ApiProperty(
    {
      type: String,
      description: "Nome do usuário",
      required: true,
      default: "Fulano",
    },
  )
  @IsString({
    message: "Nome inválido",
    context: {
      length: 100
    }
  })
  nome: string;

  @ApiProperty(
    {
      type: String,
      description: "Email do usuário",
      required: true,
      default: "AiiinnnzedaManga123@gmail.com",
    },
  )
  @IsEmail({
    allow_display_name: true,
    allow_utf8_local_part: true,
    require_tld: true,
    require_display_name: true,
  }, {
    message: "Email inválido"
  })
  email: string;

  @ApiProperty(
    {
      type: String,
      description: "Senha do usuário",
      required: true,
      default: "123456789",
    },
  )
  @IsStrongPassword({
    minLength: 1,
  }, {
    message: "Senha inválida"
  })
  senha: string;
}
