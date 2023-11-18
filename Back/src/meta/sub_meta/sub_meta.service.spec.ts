import { Test, TestingModule } from '@nestjs/testing';
import { SubMetaService } from './sub_meta.service';

describe('SubMetaService', () => {
  let service: SubMetaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubMetaService],
    }).compile();

    service = module.get<SubMetaService>(SubMetaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
