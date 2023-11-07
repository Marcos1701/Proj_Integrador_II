import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { jwtConstants } from './auth.constants';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';

export interface SingInData {
    email: string;
    senha: string;
}

export interface SingUpData {
    nome: string;
    email: string;
    senha: string;
}

export interface SingUpResponse {
    email: string;
    nome: string;
    saldo: number;
    access_token: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsuariosService,
        private jwtService: JwtService,
    ) { }

    async validarUsuario({ email, senha }: SingInData): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Usuário ou Senha Inválidos');
        }
        if (user.senha === senha) {
            return await this.gerarToken(user);
        }
        throw new UnauthorizedException('Usuário ou Senha Inválidos');
    }

    async signup(data: SingUpData): Promise<SingUpResponse> {
        const userExists = await this.usersService.findOneByEmail(data.email);
        if (userExists) {
            throw new UnauthorizedException('Usuário já cadastrado');
        }

        const usuario = await this.usersService.create(data);
        const token = await this.gerarToken(usuario);

        const { senha, ...user } = usuario;
        return {
            ...user,
            ...token
        };
    }

    private async gerarToken(payload: SingUpData) {
        const payloadToken = {
            email: payload.email,
            senha: payload.senha
        }

        return {
            access_token: this.jwtService.sign(
                payloadToken,
                {
                    secret: jwtConstants.secret,
                    expiresIn: '50s',
                },
            ),
        };
    }

}
