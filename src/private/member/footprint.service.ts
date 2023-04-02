import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FilterOperator, PaginateQuery } from 'nestjs-paginate';
import { Connection } from 'typeorm';



@Injectable()
export class FootprintService {

  constructor(
      private readonly connection: Connection,
    ) {} 
  
  // Categorías principales
  async categories(){
    const categories =  await this.connection.query('SELECT id_fp_category, category_name FROM footprint_categories fc;') as []
    // Excepción si el número de datos es igual a cero 
    if (categories.length == 0) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Contenido no encontrado.',
      }, HttpStatus.BAD_REQUEST);
    }
    return categories;
  }

  // Medidas principales
  async measurements(){
    const measurement =  await this.connection.query('SELECT id_u_measurement, measurement_name FROM units_measurements um;') as []
    // Excepción si el número de datos es igual a cero 
    if (measurement.length == 0) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Contenido no encontrado.',
      }, HttpStatus.BAD_REQUEST);
    }
    return measurement;
  }

  // Origen de las huella de carbono 
  // Los datos se filtran y dependen del id_fp_category de la tabla footprint_categories
  async origins(measurementId:number){
    let origins = [];
    if(!isNaN(+measurementId)){
      origins =  await this.connection.query('SELECT id_fp_origin, origin_name FROM footprint_origins WHERE id_fp_origin = $1;',[measurementId]) as []
    }
    // Excepción si el número de datos es igual a cero 
    if (origins.length == 0) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Contenido no encontrado.',
      }, HttpStatus.BAD_REQUEST);
    }
    return origins;
  }

  // Actividades que generan una huella de carbono 
  // Los datos se filtran y dependen del id_fp_category de la tabla footprint_categories
  async activities(categoryId:number, originId:number){
    let activities = [];
    if(!isNaN(+categoryId) && !isNaN(+originId)){
      activities =  await this.connection.query(
        'SELECT id_activity, activity_name FROM activities a WHERE id_fp_category = $1 AND id_fp_origin = $2;',
        [categoryId, originId]) as []
      console.log(activities)
    }
    // Excepción si el número de datos es igual a cero 
    if (activities.length == 0) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Contenido no encontrado.',
      }, HttpStatus.BAD_REQUEST);
    }
    return activities;
  }

}
