import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Request } from 'express';
import { FootprintService } from './footprint.service';
import { CreateCategoriesDto } from './dto/create-categories.dto';
import { Categories } from './entities/categories.entity';
import { Measurement } from './entities/measurement.entity';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { Origins } from './entities/origins.entity';
import { CreateOriginsDto } from './dto/create-origins.dto';
import { Footprint } from './entities/footprint.entity';
import { CreateFootprintDto } from './dto/create-footprint.dto';
import { Activities } from './entities/activities.entity';
import { CreateActivitiesDto } from './dto/create-activities.dto';
import { UpdateCategoriesDto } from './dto/update-categories.dto';
import { UpdateActivitiesDto } from './dto/update-activities.dto';
import { UpdateOriginsDto } from './dto/update-origins.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { UpdateFootprintDto } from './dto/update-footprint.dto';

@Controller('footprint')

export class FootprintController {
  constructor(
    private readonly footprintService: FootprintService,
    ) {}

  @Get('test')
  async testGet(){
    return 'test';
  }
  @Get('categories')
  async categoriesGet(
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
  async measurementsGet(
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
  async originsGet(
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
  async activitiesGet(
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
  async footprintGet(
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





  @Post('categories')
  async categoriesPost(@Body() createCategoriesDto: CreateCategoriesDto){
    return this.footprintService.post(
      Categories, // Entidad
      createCategoriesDto, // Data transfer object 
      'category_name'); // Propiedad a validar
  }
  
  @Post('measurement')
  async measurementPost(@Body() createMeasurementDto: CreateMeasurementDto){
    return this.footprintService.post(
      Measurement,
      createMeasurementDto, 
      'measurement_name');
  }

  @Post('origins')
  async originsPost(@Body() createOriginsDto: CreateOriginsDto){
    return this.footprintService.post(
      Origins, 
      createOriginsDto, 
      'origin_name'); 
  }

  @Post('activities')
  async activitiesPost(@Body() createActivitiesDto: CreateActivitiesDto){
    return this.footprintService.post(
      Activities, 
      createActivitiesDto, 
      "activity_name"); 
  }

  @Post('')
  async footprintPost(@Body() createFootprintDto: CreateFootprintDto){
    return this.footprintService.postPrinfoot(
      Footprint,
      createFootprintDto, 
      null); 
  }




  @Patch('categories/:id')
  async categoriesPatch(@Param('id') id: number, @Body() updateCategoriesDto: UpdateCategoriesDto){
    return this.footprintService.patch(
      +id,
      Categories, // Entidad
      updateCategoriesDto, // Data transfer object 
      'category_name', // Propiedad a validar
      'id_fp_category'); // Propiedad ID
  }

  @Patch('measurement/:id')
  async measurementPatch(@Param('id') id: number, @Body() updateMeasurementDto: UpdateMeasurementDto){
    return this.footprintService.patch(
      +id,
      Measurement,
      updateMeasurementDto,
      'measurement_name',
      'id_u_measurement');
  }

  @Patch('origins/:id')
  async originsPatch(@Param('id') id: number, @Body() updateOriginsDto: UpdateOriginsDto){
    return this.footprintService.patch(
      +id,
      Origins, // Entidad
      updateOriginsDto,
      'origin_name',
      'id_fp_origin'); 
  }

  @Patch('activities/:id')
  async activitiesPatch(@Param('id') id: number, @Body() updateActivitiesDto: UpdateActivitiesDto){
    return this.footprintService.patch(
      +id,
      Activities,
      updateActivitiesDto, 
      'activity_name',
      'id_activity');
  }

  @Patch(':id')
  async footprintPatch(@Param('id') id: number, @Body() updateFootprintDto: UpdateFootprintDto){
    return this.footprintService.patchPrintfoot(
      +id,
      Footprint,
      updateFootprintDto, 
      'activity_name',
      'id_actiid_c_footprintsvity');
  }



  @Delete('categories/:id')
  async categoriesDelete(@Param('id') id: number){
    return this.footprintService.delete(
      +id,
      Categories); // Entidad
  }

  @Delete('measurement/:id')
  async measurementDelete(@Param('id') id: number){
    return this.footprintService.delete(
      +id,
      Measurement);
  }

  @Delete('origins/:id')
  async originsDelete(@Param('id') id: number){
    return this.footprintService.delete(
      +id,
      Origins);
  }

  @Delete('activities/:id')
  async activitiesDelete(@Param('id') id: number){
    return this.footprintService.delete(
      +id,
      Activities);
  }

  @Delete(':id')
  async Delete(@Param('id') id: number){
    return this.footprintService.delete(
      +id,
      Footprint);
  }
}
