import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Header, Headers } from '@nestjs/common';
import { TransacoesService } from './transacoes.service';
import { CreateTransacoeDto } from './dto/create-transacoe.dto';
import { UpdateTransacoeDto } from './dto/update-transacoe.dto';

@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) { }

  @Post()
  async create(@Body() createTransacoeDto: CreateTransacoeDto) {
    return this.transacoesService.create(createTransacoeDto);
  }

  @Get()
  findAll(@Headers('Authorization') token: string) {
    return this.transacoesService.findAll(token);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('Authorization') token: string) {
    return this.transacoesService.findOne(id, token);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransacoeDto: UpdateTransacoeDto) {
    return this.transacoesService.update(id, updateTransacoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('Authorization') token: string) {
    return this.transacoesService.remove(id, token);
  }
}
