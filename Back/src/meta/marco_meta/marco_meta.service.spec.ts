import { Test, TestingModule } from '@nestjs/testing';
import { MarcoMetaService } from './marco_meta.service';

describe('MarcoMetaService', () => {
  let service: MarcoMetaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarcoMetaService],
    }).compile();

    service = module.get<MarcoMetaService>(MarcoMetaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
