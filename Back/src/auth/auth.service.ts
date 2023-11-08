import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { jwtConstants } from './auth.constants';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

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
    nome: string;
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
            const token = await this.gerarToken(user);
            const { senha, email, saldo, ...userResponse } = user;
            return {
                ...userResponse,
                ...token
            };
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

        const { senha, email, saldo, ...user } = usuario;
        return {
            ...user,
            ...token
        };
    }

    private async gerarToken(usuario: Usuario) {
        const payloadToken = {
            id: usuario.id,
            email: usuario.email,
        }

        return {
            access_token: this.jwtService.sign(
                payloadToken,
                {
                    secret: jwtConstants.secret
                },
            ),
        };
    }

}
