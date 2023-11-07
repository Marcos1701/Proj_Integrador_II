import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsJWT, IsString, IsStrongPassword } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {

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
    nome?: string;

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
    email?: string;

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
    senha?: string;

    @IsJWT({
        message: "Token inválido"
    })
    access_token: string;
}
