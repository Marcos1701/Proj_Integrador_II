import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Header, Headers, Query, UnauthorizedException, HttpCode } from '@nestjs/common';
import { TransacoesService } from './transacoes.service';
import { CreateTransacoeDto } from './dto/create-transacoe.dto';
import { UpdateTransacoeDto } from './dto/update-transacoe.dto';
import { TransacoesorderBy } from 'src/usuarios/entities/usuario.entity';
import { ApiBody, ApiHeader, ApiParam, ApiProperty, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ulid } from 'ulidx';

@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) { }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer token'
  })
  @ApiBody({
    type: CreateTransacoeDto,
    description: 'Transação a ser criada'
  })
  @ApiResponse({
    status: 201,
    description: 'Transação criada com sucesso',
    type: CreateTransacoeDto
  })
  @ApiResponse({
    status: 401,
    description: 'Token não encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @Post('')
  async create(@Headers('Authorization') access_token: string, @Body() createTransacoeDto: CreateTransacoeDto) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.transacoesService.create(createTransacoeDto, access_token);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer token'
  })
  @ApiResponse({
    status: 200,
    description: 'Transações encontradas',
    type: [CreateTransacoeDto]
  })
  @ApiResponse({
    status: 401,
    description: 'Token não encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @Get('')
  findAll(@Headers('Authorization') access_token: string, @Query('orderby') orderby?: TransacoesorderBy, @Query('order') order?: 'ASC' | 'DESC', @Query('search') search?: string, @Query('categoriaid') categoriaid?: string) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.transacoesService.findAll(access_token, orderby, order, search, categoriaid);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer token'
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados das transações do usuário',
    type: [CreateTransacoeDto]
  })
  @ApiResponse({
    status: 401,
    description: 'Token não encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiQuery({
    name: 'ano',
    description: 'Ano das transações',
    example: 2021
  })
  @ApiQuery({
    name: 'mes',
    description: 'Mês das transações',
    example: 4
  })
  @Get('dados')
  findDados(@Headers('Authorization') access_token: string, @Query('ano') ano?: number, @Query('mes') mes?: number) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    if (ano && mes && (!isNaN(Number(ano)) && !isNaN(Number(mes)))) {
      return this.transacoesService.findDados(access_token, Number(ano), Number(mes));
    }
    if (ano && !isNaN(Number(ano))) {
      return this.transacoesService.findDados(access_token, Number(ano));
    }
    if (mes && !isNaN(Number(mes))) {
      return this.transacoesService.findDados(access_token, null, Number(mes));
    }
    return this.transacoesService.findDados(access_token);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'access token',
    example: "abcdefd32123..."
  })
  @ApiParam({
    name: 'id',
    description: 'Id da transação',
    example: ulid()
  })
  @ApiResponse({
    status: 200,
    description: 'Transação encontrada',
    type: CreateTransacoeDto
  })
  @ApiResponse({
    status: 401,
    description: 'Token não encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Transação não encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado'
  })
  @Get(':id')
  findOne(@Param('id') id: string, @Headers('Authorization') access_token: string) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.transacoesService.findOne(id, access_token);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer token'
  })
  @ApiParam({
    name: 'id',
    description: 'Id da transação',
    example: ulid()
  })
  @ApiBody({
    type: UpdateTransacoeDto,
    description: 'Transação a ser atualizada'
  })
  @ApiResponse({
    status: 200,
    description: 'Transação atualizada com sucesso',
    type: UpdateTransacoeDto
  })
  @ApiResponse({
    status: 401,
    description: 'Token não encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Transação não encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado'
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransacoeDto: UpdateTransacoeDto, @Headers('Authorization') access_token: string) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.transacoesService.update(id, updateTransacoeDto, access_token);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer token'
  })
  @ApiParam({
    name: 'id',
    description: 'Id da transação',
    example: ulid()
  })
  @ApiResponse({
    status: 204,
    description: 'Transação removida com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Token não encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Transação não encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado'
  })
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string, @Headers('Authorization') access_token: string) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.transacoesService.remove(id, access_token);
  }
}
