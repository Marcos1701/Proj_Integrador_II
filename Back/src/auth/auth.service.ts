import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { jwtConstants } from './auth.constants';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsuariosService,
        private jwtService: JwtService,
    ) { }
    async validarUsuario(email: string, senha: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Usuário ou Senha Inválidos');
        }
        if (user.senha === senha) {
            return await this.gerarToken(user);
        }
        throw new UnauthorizedException('Usuário ou Senha Inválidos');
    }

    async signup(user: CreateUsuarioDto): Promise<any> {
        const userExists = await this.usersService.findOneByEmail(user.email);
        if (userExists) {
            throw new UnauthorizedException('Usuário já cadastrado');
        }

        return await this.usersService.create(user);
    }

    private async gerarToken(payload: Usuario) {
        return {
            access_token: this.jwtService.sign(
                {
                    email: payload.email,
                    senha: payload.senha
                },
                {
                    secret: jwtConstants.secret,
                    expiresIn: '50s',
                },
            ),
        };
    }

}
