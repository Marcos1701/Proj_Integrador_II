import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UnauthorizedException, HttpCode } from '@nestjs/common';
import { MarcoMetaService } from './marco_meta.service';
import { CreateMarcoMetaDto } from './dto/create-marco_meta.dto';
import { UpdateMarcoMetaDto } from './dto/update-marco_meta.dto';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';

@Controller('meta/:id/marco')
export class MarcoMetaController {
  constructor(private readonly marcoMetaService: MarcoMetaService) { }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer token'
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
    status: 201,
    description: 'Marco criado com sucesso',
    type: CreateMarcoMetaDto
  })
  @Post()
  create(@Headers('Authorization') access_token: string, @Param('id') id_meta: string, @Body() createMarcoMetaDto: CreateMarcoMetaDto) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado'); // 401
    }
    return this.marcoMetaService.create(access_token, id_meta, createMarcoMetaDto);
  }


  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer token'
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
    status: 200,
    description: 'Marcos encontrados',
    type: [CreateMarcoMetaDto]
  })
  @Get()
  findAll(@Headers('Authorization') access_token: string, @Param('id') id_meta: string) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado'); // 401
    }
    return this.marcoMetaService.findAll(access_token, id_meta);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer token'
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
    status: 404,
    description: 'Marco não encontrado',
  })
  @ApiResponse({
    status: 200,
    description: 'Marco encontrado',
    type: CreateMarcoMetaDto
  })
  @Get(':id_marco')
  findOne(@Headers('Authorization') access_token: string, @Param('id') id_meta: string, @Param('id_marco') id: string) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado'); // 401
    }
    return this.marcoMetaService.findOne(access_token, id_meta, id);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer token'
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
    status: 404,
    description: 'Marco não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Nenhuma alteração foi feita'
  })
  @ApiResponse({
    status: 200,
    description: 'Marco atualizado com sucesso',
    type: CreateMarcoMetaDto
  })
  @Patch(':id_marco')
  update(@Headers('Authorization') access_token: string, @Param('id') id_meta: string, @Param('id_marco') id: string, @Body() updateMarcoMetaDto: UpdateMarcoMetaDto) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado'); // 401
    }
    return this.marcoMetaService.update(access_token, id_meta, id, updateMarcoMetaDto);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer token'
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
    status: 404,
    description: 'Marco não encontrado',
  })
  @ApiResponse({
    status: 204,
    description: 'Marco deletado com sucesso',
    type: CreateMarcoMetaDto
  })
  @HttpCode(204)
  @Delete(':id_marco')
  remove(@Headers('Authorization') access_token: string, @Param('id') id_meta: string, @Param('id_marco') id: string) {
    return this.marcoMetaService.remove(access_token, id_meta, id);
  }
}
