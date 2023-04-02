import { Module } from '@nestjs/common';
import { FootprintService } from './footprint.service';
import { FootprintController } from './footprint.controller';


@Module({
  imports: [
  ],
  controllers: [FootprintController],
  providers: [
    FootprintService,
  ],
  exports:[
    FootprintService
  ]
})
export class FootprintModule {}
