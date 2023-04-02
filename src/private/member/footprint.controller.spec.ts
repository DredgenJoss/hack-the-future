import { Test, TestingModule } from '@nestjs/testing';
import { FootprintController } from './footprint.controller';
import { FootprintService } from './footprint.service';

describe('FootprintController', () => {
  let controller: FootprintController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FootprintController],
      providers: [FootprintService],
    }).compile();

    controller = module.get<FootprintController>(FootprintController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
