import { Module } from '@nestjs/common';
import { SubMetaService } from './sub_meta.service';
import { SubMetaController } from './sub_meta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubMeta } from './entities/sub_meta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubMeta])],
  controllers: [SubMetaController],
  providers: [SubMetaService],
})
export class SubMetaModule { }
