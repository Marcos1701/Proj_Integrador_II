import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) { }

  @Post()
  async create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Get()
  async findAll(@Headers('Authorization') token: string) {
    return this.categoriasService.findAll(token);
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
