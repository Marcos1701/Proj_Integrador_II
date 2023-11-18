import { Module } from '@nestjs/common';
import { MetaService } from './meta.service';
import { MetaController } from './meta.controller';
import { SubMetaModule } from './sub_meta/sub_meta.module';
import { MarcoMetaModule } from './marco_meta/marco_meta.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meta } from './entities/meta.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Meta]), SubMetaModule, MarcoMetaModule],
  controllers: [MetaController],
  providers: [MetaService],
})
export class MetaModule { }