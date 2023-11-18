import { Test, TestingModule } from '@nestjs/testing';
import { MarcoMetaController } from './marco_meta.controller';
import { MarcoMetaService } from './marco_meta.service';

describe('MarcoMetaController', () => {
  let controller: MarcoMetaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarcoMetaController],
      providers: [MarcoMetaService],
    }).compile();

    controller = module.get<MarcoMetaController>(MarcoMetaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
