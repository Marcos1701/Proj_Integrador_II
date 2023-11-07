import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Header, Headers, Query } from '@nestjs/common';
import { TransacoesService } from './transacoes.service';
import { CreateTransacoeDto } from './dto/create-transacoe.dto';
import { UpdateTransacoeDto } from './dto/update-transacoe.dto';
import { TransacoesorderBy, ordenarTransacoes } from 'src/usuarios/entities/usuario.entity';

@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) { }

  @Post()
  async create(@Headers('Authorization') access_token: string, @Body() createTransacoeDto: CreateTransacoeDto) {
    return this.transacoesService.create(createTransacoeDto, access_token);
  }

  @Get()
  findAll(@Headers('Authorization') access_token: string, @Query('orderby') orderby?: TransacoesorderBy, @Query('order') order?: 'ASC' | 'DESC', @Query('search') search?: string, @Query('categoriaid') categoriaid?: string) {
    return this.transacoesService.findAll(access_token, orderby, order, search, categoriaid);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('Authorization') token: string) {
    return this.transacoesService.findOne(id, token);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransacoeDto: UpdateTransacoeDto, @Headers('Authorization') access_token: string) {
    return this.transacoesService.update(id, updateTransacoeDto, access_token);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('Authorization') token: string) {
    return this.transacoesService.remove(id, token);
  }
}
