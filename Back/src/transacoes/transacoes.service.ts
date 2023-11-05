import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateTransacoeDto } from './dto/create-transacoe.dto';
import { UpdateTransacoeDto } from './dto/update-transacoe.dto';
import { DeleteResult, EntityManager, UpdateResult } from 'typeorm';
import { Transacao } from './entities/transacao.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TransacoesService {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }


  async create(createTransacoeDto: CreateTransacoeDto) {

    const categoria = await this.entityManager.findOne(
      Categoria,
      {
        where: {
          id: createTransacoeDto.categoriaid,
          usuario: {
            JWT: createTransacoeDto.usuariotoken
          }
        }
      });

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const result = await this.entityManager.save(
      Transacao, {
      ...createTransacoeDto,
      categoria: categoria,
      usuario: categoria.usuario
    });

    if (!result) {
      throw new NotFoundException('Transação não encontrada');
    }
    return result;
  }


  async findOne(id: string, usuariotoken: string) {
    return this.entityManager.findOne(
      Transacao, {
      where: {
        id,
        usuario: {
          JWT: usuariotoken
        }
      }
    });
  }

  async findAll(usuariotoken: string) {
    return await this.entityManager.find(
      Transacao, {
      where: {
        usuario: {
          JWT: usuariotoken
        }
      }
    });
  }



  async update(id: string, updateTransacoeDto: UpdateTransacoeDto) {

    const result: UpdateResult = await this.entityManager.update(
      Transacao, {
      id,
      usuario: {
        JWT: updateTransacoeDto.usuariotoken
      }
    },
      { ...updateTransacoeDto }
    );

    if (result.affected === 0) {
      throw new NotFoundException('Transação não encontrada');
    }

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  async remove(id: string, usuariotoken: string) {
    const result: DeleteResult = await this.entityManager.delete(
      Transacao, {
      id,
      usuario: {
        JWT: usuariotoken
      }
    });

    if (result.affected === 0) {
      throw new NotFoundException('Transação não encontrada');
    }
    return result;
  }
}
