import { Module } from '@nestjs/common';
import { MarcoMetaService } from './marco_meta.service';
import { MarcoMetaController } from './marco_meta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcoMeta } from './entities/marco_meta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MarcoMeta])],
  controllers: [MarcoMetaController],
  providers: [MarcoMetaService],
})
export class MarcoMetaModule { }
