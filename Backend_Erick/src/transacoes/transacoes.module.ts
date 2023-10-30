import { Module } from '@nestjs/common';
import { TransacoesService } from './transacoes.service';
import { TransacoesController } from './transacoes.controller';

@Module({
  controllers: [TransacoesController],
  providers: [TransacoesService],
})
export class TransacoesModule {}
