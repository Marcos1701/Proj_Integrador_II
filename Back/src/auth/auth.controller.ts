import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SingInData } from './auth.models';
import { AuthService, SingUpData } from './auth.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @ApiResponse({
        status: 200,
        description: 'Login realizado com sucesso.',
        schema: {
            type: 'object',
            properties: {
                access_token: {
                    type: 'string',
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFpaWlubnplZGFNYW5nYTEyM0BnbWFpbC5jb20iLCJpYXQiOjE2MzI1NjQ0NzIsImV4cCI6"
                }
            }
        }
    })
    @ApiResponse({
        status: 401,
        description: 'Usuário ou Senha Inválidos',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    example: "marcos123321@gmail.com",
                },
                senha: {
                    type: 'string',
                    example: "123456789",
                }
            }
        }
    })

    // @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() data: SingInData) {
        return this.authService.validarUsuario(data);
    }

    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        content: {
            Body: {
                schema: {
                    type: 'object',
                    properties: {
                        user: {
                            type: 'object',
                            properties: {
                                nome: {
                                    type: 'string',
                                    example: 'John Doe',
                                },
                                email: {
                                    type: 'string',
                                    example: "AiiinnnzedaManga123@gmail.com",
                                },
                                senha: {
                                    type: 'string',
                                    description: 'The password of the user.',
                                    example: '123456789',
                                },
                                saldo: {
                                    type: 'number',
                                    description: 'The balance of the user.',
                                    example: 0,
                                },
                            },
                        },
                        access_token: {
                            type: 'string',
                            description: 'The token of the user.',
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFpaWlubnplZGFNYW5nYTEyM0BnbWFpbC5jb20iLCJpYXQiOjE2MzI1NjQ0NzIsImV4cCI6"
                        }
                    }
                }
            }
        }
    }) // retorna o usuário criado e o token
    @ApiResponse({
        status: 401,
        description: 'Usuário já cadastrado',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                nome: {
                    type: 'string',
                    example: 'Marcos Neiva',
                },
                email: {
                    type: 'string',
                    example: "marcos123321@gmail.com",
                },
                senha: {
                    type: 'string',
                    example: "123456789",
                }
            }
        }
    })
    @Post('signup')
    async signup(@Body() user: SingUpData) {
        return this.authService.signup(user);
    }
}
