import { Injectable } from '@nestjs/common';
import { CreateTransacoeDto } from './dto/create-transacoe.dto';
import { UpdateTransacoeDto } from './dto/update-transacoe.dto';

@Injectable()
export class TransacoesService {
  create(createTransacoeDto: CreateTransacoeDto) {
    return 'This action adds a new transacoe';
  }

  findAll() {
    return `This action returns all transacoes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transacoe`;
  }

  update(id: number, updateTransacoeDto: UpdateTransacoeDto) {
    return `This action updates a #${id} transacoe`;
  }

  remove(id: number) {
    return `This action removes a #${id} transacoe`;
  }
}
