import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers, Query } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CategoriasorderBy, orderByCategorias } from 'src/usuarios/entities/usuario.entity';



@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) { }

  @Post()
  async create(@Body() createCategoriaDto: CreateCategoriaDto, @Headers('Authorization') token: string) {
    return this.categoriasService.create(createCategoriaDto, token);
  }


  @Get('')
  async findAll(@Headers('Authorization') token: string, @Query('order') order?: 'ASC' | 'DESC', @Query('orderby') orderby?: orderByCategorias, @Query('search') search?: string) {
    return this.categoriasService.findAll(
      token,
      orderby ? orderby : null,
      order ? order : null,
      search ? search : null,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Headers('Authorization') token: string) {
    return this.categoriasService.findOne(id, token);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriasService.update(id, updateCategoriaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoriasService.remove(id);
  }
}
