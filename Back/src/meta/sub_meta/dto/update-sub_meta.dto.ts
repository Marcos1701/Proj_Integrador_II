import { PartialType } from '@nestjs/mapped-types';
import { CreateSubMetaDto } from './create-sub_meta.dto';

export class UpdateSubMetaDto extends PartialType(CreateSubMetaDto) {}
