import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransacoesService } from './transacoes.service';
import { CreateTransacoeDto } from './dto/create-transacoe.dto';
import { UpdateTransacoeDto } from './dto/update-transacoe.dto';

@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) {}

  @Post()
  create(@Body() createTransacoeDto: CreateTransacoeDto) {
    return this.transacoesService.create(createTransacoeDto);
  }

  @Get()
  findAll() {
    return this.transacoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transacoesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransacoeDto: UpdateTransacoeDto) {
    return this.transacoesService.update(+id, updateTransacoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transacoesService.remove(+id);
  }
}
