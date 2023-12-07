import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UnauthorizedException, HttpCode, Query, BadRequestException } from '@nestjs/common';
import { MetaService } from './meta.service';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { ApiBody, ApiHeader, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Metasorderby } from 'src/usuarios/entities/usuario.entity';

@Controller('meta')
export class MetaController {
  constructor(private readonly metaService: MetaService) { }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer token'
  })
  @ApiResponse({
    status: 401,
    description: 'Token não encontrado',
  })
  @ApiBody({
    type: CreateMetaDto
  })
  @ApiResponse({
    status: 201,
    description: 'Meta criada com sucesso',
    type: CreateMetaDto
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Token não encontrado',
  })
  @Post()
  create(@Headers('Authorization') access_token: string, @Body() createMetaDto: CreateMetaDto) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.metaService.create(access_token, createMetaDto);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer token'
  })
  @ApiResponse({
    status: 200,
    description: 'Metas encontradas',
    schema: {
      type: 'array',
      example: [{
        "id": "c1b9c1d9-0f0a-4e0f-8a6b-6a8b4b7b0c1e",
        "titulo": "Meta de teste",
        "descricao": "Meta de teste",
        "valor": 100,
        "valorAtual": 50,
        "progresso": 50,
        "dataLimite": "2023-12-25T02:11:01.000Z",
        "dataCriacao": "2023-07-25T02:11:01.000Z",
        "icon": "dollar-bill",
        "concluida": false,
        "ativo": true,
        "usuarioid": "c1b9c1d9-0f0a-4e0f-8a6b-6a8b4b7b0c1e",
        "SubMetas": [{
          "id": "c1b9c1d9-0f0a-4e0f-8a6b-6a8b4b7b0c1e",
          "titulo": "Meta de teste",
          "valor": 100,
          "concluida": false,
          "metaid": "c1b9c1d9-0f0a-4e0f-8a6b-6a8b4b7b0c1e"
        }],
        "marcos": [
          {
            "id": "c1b9c1d9-0f0a-4e0f-8a6b-6a8b4b7b0c1e",
            "titulo": "Meta de teste",
            "valor": 100,
            "concluida": false,
            "metaid": "c1b9c1d9-0f0a-4e0f-8a6b-6a8b4b7b0c1e"
          }
        ]
      }]
    }
  })
  @ApiQuery({
    name: 'orderby',
    enum: Metasorderby,
    required: false,
    description: 'parametro de ordenação'
  })
  @ApiQuery({
    name: 'order',
    enum: ['ASC', 'DESC'],
    required: false,
    description: 'sentido de ordenação'
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'termo de busca'
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Token não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'parametro de ordenação inválido',
  })
  @ApiResponse({
    status: 400,
    description: 'sentido de ordenação inválido',
  })
  @Get()
  findAll(@Headers('Authorization') access_token: string, @Query('orderby') orderby?: Metasorderby, @Query('order') order?: 'ASC' | 'DESC', @Query('search') search?: string) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado'); // 401
    }
    if (orderby && !Object.values(Metasorderby).includes(orderby)) {
      throw new BadRequestException('orderby não encontrado'); // 400
    }
    if (order && order !== 'ASC' && order !== 'DESC') {
      throw new BadRequestException('order não encontrado'); // 400
    }
    return this.metaService.findAll(access_token, orderby, order, search);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer token'
  })
  @ApiResponse({
    status: 200,
    description: 'Meta encontrada',
    schema: {
      type: 'object',
      example: {
        "id": "c1b9c1d9-0f0a-4e0f-8a6b-6a8b4b7b0c1e",
        "titulo": "Meta de teste",
        "descricao": "Meta de teste",
        "valor": 100,
        "valorAtual": 50,
        "progresso": 50,
        "dataLimite": "2023-12-25T02:11:01.000Z",
        "dataCriacao": "2023-07-25T02:11:01.000Z",
        "icon": "dollar-bill",
        "concluida": false,
        "ativo": true,
        "usuarioid": "c1b9c1d9-0f0a-4e0f-8a6b-6a8b4b7b0c1e",
        "SubMetas": [{
          "id": "c1b9c1d9-0f0a-4e0f-8a6b-6a8b4b7b0c1e",
          "titulo": "Meta de teste",
          "valor": 100,
          "concluida": false,
          "metaid": "c1b9c1d9-0f0a-4e0f-8a6b-6a8b4b7b0c1e"
        }],
        "marcos": [
          {
            "id": "c1b9c1d9-0f0a-4e0f-8a6b-6a8b4b7b0c1e",
            "titulo": "Meta de teste",
            "valor": 100,
            "concluida": false,
            "metaid": "c1b9c1d9-0f0a-4e0f-8a6b-6a8b4b7b0c1e"
          }
        ]
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Meta não encontrada',
  })
  @ApiResponse({
    status: 401,
    description: 'Token não encontrado',
  })
  @Get(':id')
  findOne(@Headers('Authorization') access_token: string, @Param('id') id: string) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.metaService.findOne(access_token, id);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer token'
  })
  @ApiBody({
    type: UpdateMetaDto
  })
  @ApiResponse({
    status: 200,
    description: 'Meta atualizada com sucesso',
    type: UpdateMetaDto
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Meta não encontrada',
  })
  @ApiResponse({
    status: 401,
    description: 'Token não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Nenhuma alteração foi feita',
  })
  @Patch(':id')
  update(@Headers('Authorization') access_token: string, @Param('id') id: string, @Body() updateMetaDto: UpdateMetaDto) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.metaService.update(access_token, id, updateMetaDto);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer token'
  })
  @ApiResponse({
    status: 204,
    description: 'Meta removida com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Meta não encontrada',
  })
  @ApiResponse({
    status: 401,
    description: 'Token não encontrado',
  })
  @HttpCode(204)
  @Delete(':id')
  remove(@Headers('Authorization') access_token: string, @Param('id') id: string) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.metaService.remove(access_token, id);
  }

  @Patch(':id/addvalor')
  AdicionarValor(@Headers('Authorization') access_token: string, @Param('id') id: string, @Body() body: { valor: number }) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.metaService.AdicionarValor(access_token, id, body.valor);
  }
}
