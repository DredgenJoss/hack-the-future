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
  async categories(
    @Query('page') page: number, 
    @Query('limit') limit: number, 
    @Query('search') search: string
    ) {

    let where = '';
    if(search){
      where = `category_name LIKE \'%${search}\%'`;
    }

    return await this.footprintService.getAll(
      'categories', // Nombre de endpoint
      page, // Número de página
      limit, // Número de ítems
      ['id_fp_category', 'category_name'], // Campos 
      'footprint_categories', // Tabla
      where, // Where :v
      search // Parámetro de para realizar búsquedas
      );
  }

  @Get('categories/:id')
  async categoriesByid(@Param('id') id: number) {
   return this.footprintService.getByid('footprint_categories', +id)
  }

  @Get('measurement')
  async measurements(
    @Query('page') page: number, 
    @Query('limit') limit: number, 
    @Query('search') search: string
    ) {

    let where = '';
    if(search){
      where = `measurement_name LIKE \'%${search}\%'`;
    }

    return await this.footprintService.getAll(
      'measurement',
      page, 
      limit, 
      ['id_u_measurement', 'measurement_name'],
      'units_measurements', 
      where,
      search
      );
  }

  @Get('measurement/:id')
  async measurementByid(@Param('id') id: number) {
   return this.footprintService.getByid('units_measurements', +id)
  }

  @Get('origins/:measurementId')
  async origins(
    @Query('page') page: number, 
    @Query('limit') limit: number, 
    @Param('measurementId') measurementId: number, 
    @Query('search') search: string
    ) {
      
    if (!isNaN(+measurementId) && +measurementId >= 1){

      let where = '';
      where = `id_u_measurement = ${measurementId}`;

      if(search){
        where += ` AND origin_name LIKE \'%${search}%\'`;
      }

      return await this.footprintService.getAll(
        `origins/${measurementId}`,
        page, 
        limit,
        ['id_fp_origin', 'origin_name'],
        'footprint_origins', 
        where,
        search
        );
    }
      
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      message: 'Contenido no encontrado.',
    }, HttpStatus.BAD_REQUEST);

  }

  @Get('activities')
  async activities(
    @Query('page') page: number, 
    @Query('limit') limit: number, 
    @Query('categoryId') categoryId: number, 
    @Query('originId') originId: number,
    @Query('search') search: string
    ) {

    if ((!isNaN(+categoryId) && +categoryId >= 1) && (!isNaN(+originId) && +originId >= 1)){

      let where = '';
      where = `id_fp_category = ${categoryId} and id_fp_origin = ${originId}`;

      if(search){
        where += ` AND activity_name LIKE \'%${search}%\'`;
      }

      return await this.footprintService.getAll(
        `activities`,
        page, 
        limit, 
        ['id_activity', 'activity_name'],
        'activities', 
        where,
        search
        );
    }
    
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      message: 'Contenido no encontrado.',
    }, HttpStatus.BAD_REQUEST);
  }

  @Get('activities/:id')
  async activitiesByid(@Param('id') id: number) {
   return this.footprintService.getByid('activities', +id)
  }


  @Get('')
  async footprint(
    @Query('page') page: number, 
    @Query('limit') limit: number, 
    @Query('categoryId') categoryId: number, 
    @Query('originId') originId: number,
    @Query('activityId') activityId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('search') search: string
    ) {
    
    let where = '';
    // Id de categoría
    if (!isNaN(+categoryId) && +categoryId >= 1){
      where = `id_fp_category = ${categoryId}`;
    }
    // Id de origen
    if (!isNaN(+originId) && +originId >= 1){
      where = where? where + ' AND ': where;
      where += `id_fp_origin = ${originId}`;
    }
    // Id de actividad
    if (!isNaN(+activityId) && +activityId >= 1){
      where = where? where + ' AND ': where;
      where += `id_activity = ${activityId}`;
    }
    // Fecha inicial
    if(startDate){
      where = where? where + ' AND ': where;
      where += `created_at >= \'${startDate}\' `;
    }
    // Fecha final
    if(endDate){
      where = where? where + ' AND ': where;
      where += `created_at <= \'${endDate}\' `;
    }
    // Búsqueda
    if(!isNaN(+search) && +search >= 0){
      where = where? where + ' AND ': where;
      where += `quantity = ${+search} `;
    } else if(search){
      where = where? where + ' AND ': where;
      where += `note LIKE \'%${search}%\'`;
    }

    return await this.footprintService.getAll(
      `footprint`,
      page, 
      limit, 
      ['id_c_footprints', 'quantity', 'note'],
      'carbono_footprints', 
      where,
      search
      );
  }

  @Get(':id')
  async footprintByid(@Param('id') id: number) {
   return this.footprintService.getByid('carbono_footprints', +id)
  }

}
