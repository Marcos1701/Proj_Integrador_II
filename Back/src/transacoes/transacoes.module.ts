import { Module } from '@nestjs/common';
import { TransacoesService } from './transacoes.service';
import { TransacoesController } from './transacoes.controller';
import { Transacao } from './entities/transacao.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransacaoSubscriber } from './subscribers/transacao.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Transacao])],
  controllers: [TransacoesController],
  providers: [TransacoesService, TransacaoSubscriber],
  exports: [TransacoesService]
})
export class TransacoesModule { }