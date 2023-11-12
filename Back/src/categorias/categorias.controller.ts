import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers, Query } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CategoriasorderBy } from 'src/usuarios/entities/usuario.entity';
import { ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';



@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) { }

  @ApiResponse({
    status: 201,
    description: 'Cria uma nova categoria',
    type: CreateCategoriaDto,
    schema: {
      example: {
        "nome": "string",
        "descricao": "string"
      }
    }
  })
  @ApiBody({
    type: CreateCategoriaDto,
    description: 'Cria uma nova categoria'
  })
  @Post('')
  async create(@Headers('Authorization') token: string, @Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto, token);
  }


  @ApiResponse({
    status: 200,
    description: 'Retorna todas as categorias',
    type: CreateCategoriaDto,
    schema: {
      example: {
        "nome": "string",
        "descricao": "string"
      }
    }
  })
  @ApiQuery({
    name: 'order',
    enum: ['ASC', 'DESC'],
    required: false,
    description: 'Ordenação das categorias'
  })
  @ApiQuery({
    name: 'orderby',
    enum: ['nome', 'descricao', 'orcamento'],
    required: false,
    description: 'Ordenar por'
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Pesquisar por'
  })
  @Get('')
  async findAll(@Headers('Authorization') token: string, @Query('order') order?: 'ASC' | 'DESC', @Query('orderby') orderby?: CategoriasorderBy, @Query('search') search?: string) {
    const ordem = order ? order : 'ASC';
    const ordenarpor = orderby ? orderby : null;
    const pesquisarpor = search ? search : null;

    return this.categoriasService.findAll(
      token,
      ordenarpor,
      ordem,
      pesquisarpor
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Retorna uma categoria',
    type: CreateCategoriaDto,
    schema: {
      example: {
        "nome": "string",
        "descricao": "string"
      }
    }
  })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria'
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @Headers('Authorization') access_token: string) {
    return this.categoriasService.findOne(id, access_token);
  }

  @ApiResponse({
    status: 200,
    description: 'Atualiza uma categoria',
    type: CreateCategoriaDto,
    schema: {
      example: {
        "nome": "string",
        "descricao": "string"
      }
    }
  })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria'
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoriaDto: UpdateCategoriaDto, @Headers('Authorization') token: string) {
    return this.categoriasService.update(id, updateCategoriaDto, token);
  }

  @ApiResponse({
    status: 204,
    description: 'Remove uma categoria',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria'
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @Headers('Authorization') access_token: string) {
    return this.categoriasService.remove(id, access_token);
  }
}
