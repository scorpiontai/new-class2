import { Test, TestingModule } from '@nestjs/testing';
import { StoreFileService } from './store-file.service';

describe('StoreFileService', () => {
  let service: StoreFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreFileService],
    }).compile();

    service = module.get<StoreFileService>(StoreFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
