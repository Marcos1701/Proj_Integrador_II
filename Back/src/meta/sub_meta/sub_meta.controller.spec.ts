import { Test, TestingModule } from '@nestjs/testing';
import { SubMetaController } from './sub_meta.controller';
import { SubMetaService } from './sub_meta.service';

describe('SubMetaController', () => {
  let controller: SubMetaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubMetaController],
      providers: [SubMetaService],
    }).compile();

    controller = module.get<SubMetaController>(SubMetaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
