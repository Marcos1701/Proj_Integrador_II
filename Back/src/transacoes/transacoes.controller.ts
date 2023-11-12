import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Header, Headers, Query, UnauthorizedException, HttpCode } from '@nestjs/common';
import { TransacoesService } from './transacoes.service';
import { CreateTransacoeDto } from './dto/create-transacoe.dto';
import { UpdateTransacoeDto } from './dto/update-transacoe.dto';
import { TransacoesorderBy } from 'src/usuarios/entities/usuario.entity';

@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) { }

  @Post('')
  async create(@Headers('Authorization') access_token: string, @Body() createTransacoeDto: CreateTransacoeDto) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.transacoesService.create(createTransacoeDto, access_token);
  }

  @Get('')
  findAll(@Headers('Authorization') access_token: string, @Query('orderby') orderby?: TransacoesorderBy, @Query('order') order?: 'ASC' | 'DESC', @Query('search') search?: string, @Query('categoriaid') categoriaid?: string) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.transacoesService.findAll(access_token, orderby, order, search, categoriaid);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('Authorization') access_token: string) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.transacoesService.findOne(id, access_token);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransacoeDto: UpdateTransacoeDto, @Headers('Authorization') access_token: string) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.transacoesService.update(id, updateTransacoeDto, access_token);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string, @Headers('Authorization') access_token: string) {
    if (!access_token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    return this.transacoesService.remove(id, access_token);
  }
}
