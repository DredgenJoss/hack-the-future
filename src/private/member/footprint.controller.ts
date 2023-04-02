import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Request } from 'express';
import { FootprintService } from './footprint.service';

@Controller('footprint')

export class FootprintController {
  constructor(
    private readonly footprintService: FootprintService,
    ) {}

  @Get('categories')
  async categories() {
    return await this.footprintService.categories();
  }

  @Get('measurement')
  async measurements() {
    return await this.footprintService.measurements();
  }

  @Get('origins/:measurementId')
  async origins(@Param('measurementId') measurementId: number) {
    return await this.footprintService.origins(measurementId);
  }

  @Get('activities')
  async activities(@Query('categoryId') categoryId: number, @Query('originId') originId: number) {
    return await this.footprintService.activities(categoryId, originId);
  }

}
