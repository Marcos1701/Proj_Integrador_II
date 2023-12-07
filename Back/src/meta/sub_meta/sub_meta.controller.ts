import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UnauthorizedException, Query, BadRequestException, HttpCode } from '@nestjs/common';
import { SubMetaService } from './sub_meta.service';
import { CreateSubMetaDto } from './dto/create-sub_meta.dto';
import { UpdateSubMetaDto } from './dto/update-sub_meta.dto';
import { ApiBody, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { SubMeta } from './entities/sub_meta.entity';
import { FindAllMetaDto, Metadirection, Metaorderby } from './Queries_interfaces/find-all.interface';

@Controller('meta/:id/sub-meta')
export class SubMetaController {
  constructor(private readonly subMetaService: SubMetaService) { }

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
    type: CreateSubMetaDto
  })
  @ApiResponse({
    status: 201,
    description: 'SubMeta criada com sucesso',
    type: CreateSubMetaDto
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @Post()
  create(@Headers('Authorization') access_token: string, @Param('id') id_meta: string, @Body() createSubMetaDto: CreateSubMetaDto) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.subMetaService.create(access_token, id_meta, createSubMetaDto);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer token'
  })
  @ApiResponse({
    status: 401,
    description: 'Token não encontrado',
  })
  @ApiResponse({
    status: 200,
    description: 'SubMetas encontradas',
    type: [SubMeta]
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @Get()
  findAll(@Headers('Authorization') access_token: string, @Param('id') id_meta: string, @Query('orderby') orderby?: Metaorderby, @Query('order') direction?: Metadirection, @Query('search') search?: string, @Query('metaid') metaid?: string) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    if (orderby && !Object.values(Metaorderby).includes(orderby)) {
      throw new BadRequestException('orderby não encontrado');
    }
    if (direction && !Object.values(Metadirection).includes(direction)) {
      throw new BadRequestException('order não encontrado');
    }

    const query: FindAllMetaDto = {
      orderby,
      direction,
      search,
      metaid
    }

    return this.subMetaService.findAll(access_token, id_meta, query);
  }

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
    type: [CreateSubMetaDto]
  })
  @Post('many')
  create_many(@Headers('Authorization') access_token: string, @Param('id') id_meta: string, @Body() createSubMetaDto: CreateSubMetaDto[]) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    if (!Array.isArray(createSubMetaDto)) {
      throw new BadRequestException('O atributo submetas deve ser um array');
    }

    return this.subMetaService.create_many(access_token, id_meta, createSubMetaDto);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer token'
  })
  @ApiResponse({
    status: 401,
    description: 'Token não encontrado',
  })
  @ApiResponse({
    status: 200,
    description: 'SubMeta encontrada',
    type: SubMeta
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @Get(':id_sub_meta')
  findOne(@Headers('Authorization') access_token: string, @Param('id') id_meta: string, @Param('id_sub_meta') id_sub_meta: string) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.subMetaService.findOne(access_token, id_meta, id_sub_meta);
  }

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
    type: UpdateSubMetaDto
  })
  @ApiResponse({
    status: 200,
    description: 'SubMeta atualizada com sucesso',
    type: UpdateSubMetaDto
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'SubMeta não encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Nenhuma alteração foi feita',
  })
  @Patch(':id_sub_meta')
  update(@Headers('Authorization') access_token: string, @Param('id') id_meta: string, @Param('id_sub_meta') id_sub_meta: string, @Body() updateSubMetaDto: UpdateSubMetaDto) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.subMetaService.update(access_token, id_meta, id_sub_meta, updateSubMetaDto);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer token'
  })
  @ApiResponse({
    status: 401,
    description: 'Token não encontrado',
  })
  @ApiResponse({
    status: 204,
    description: 'SubMeta removida com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'SubMeta não encontrada',
  })
  @HttpCode(204)
  @Delete(':id_sub_meta')
  remove(@Headers('Authorization') access_token: string, @Param('id') id: string, @Param('id_sub_meta') id_sub_meta: string) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.subMetaService.remove(access_token, id, id_sub_meta);
  }
}
