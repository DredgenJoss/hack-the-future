import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FilterOperator, PaginateQuery } from 'nestjs-paginate';
import { Connection, getRepository } from 'typeorm';
import { Footprint } from './entities/footprint.entity';
import { Categories } from './entities/categories.entity';
import { Origins } from './entities/origins.entity';
import { Activities } from './entities/activities.entity';
import { Measurement } from './entities/measurement.entity';



@Injectable()
export class FootprintService {

  constructor(
      private readonly connection: Connection,
    ) {} 

  //** Listar registros con paginación */ 
  async getAll(endPointName:string, page:number, items:number, fields:string[], table:string, where:string, search:string){
    
    // Validacion de where
    const whereRegex = /where/i;
    if (where && !whereRegex.test(where)){
      where = 'WHERE ' + where + ' ';
    }

    // Se cuenta el número total de registros.
    const total_items =  await this.connection.query(
      `SELECT CAST(count(*) AS INT) FROM ${table} tb ${where};`,
      );
    // Paginación
    const pagination_meta = await this.pagination(page, items, total_items);
    
    // Consulta de datos
    let datos = [];
    const query = `
    SELECT ${fields.toString()} 
    FROM ${table} tb 
    ${where} 
    OFFSET ${pagination_meta.page} ROWS 
    FETCH NEXT ${pagination_meta.items} ROWS ONLY;`;
    try {
      datos =  await this.connection.query(
        query
      ) as [];
    } catch (e){
      console.log(e)
    }
    

    // Excepción si el número de datos es igual a cero 
    if (datos.length == 0) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Contenido no encontrado.',
      }, HttpStatus.BAD_REQUEST);
    }

    // Formato del response
    return this.paginateMeta(endPointName, datos, pagination_meta, +page, search)
  }

  // Optener un registro por medui de su id
  async getByid(table:string, id:number){
    let datos
    if (!isNaN(+id) && +id >= 1){
      const tableId =  await this.connection.query(`
        SELECT a.attname AS id
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = '${table}'::regclass AND i.indisprimary;`,
        );

      datos =  await this.connection.query(
        `SELECT * FROM ${table} tb where ${tableId[0].id} = ${id};`,
        );
    }

    if (datos.length == 0) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Contenido no encontrado.',
      }, HttpStatus.BAD_REQUEST);
    }

    return datos;
  }

  async post(entity, dto, property){

    // Se validan datos repetidos
    if (property){
      const data = await this.connection
        .getRepository(entity)
        .createQueryBuilder('e')
        .where(`e.${property} = :dto`, {
          dto: dto[property]
        })
        .getOne();
      if (data) {
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'Este nombre ya ha sido registrado.',
        }, HttpStatus.FORBIDDEN);
      }
    }

    let row;
    // Inicia la una nueva conexión a la base de datos
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{
      // Se realiza la transacción
      row = await queryRunner.manager.save(entity, dto);
      await queryRunner.commitTransaction();
    } catch (error) {
      // No se pudo realizar la transacción
      await queryRunner.rollbackTransaction();
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: error!.response!.error ?? 'Error al crear un nuevo registro.',
      }, HttpStatus.FORBIDDEN);
    } finally {
      // Se cierra la conexión a la base de datos
      await queryRunner.release();
    }
    return row;
  }

  async postPrinfoot(entity, dto, property){

    // Validación de los IDs
    let measurement_id;
    try {
     
      const consulta = await this.consultas(dto)
        
       if (consulta[2]['id_fp_category'] != consulta[0]['id_fp_category']  || consulta[2]['id_fp_origin'] != consulta[1]['id_fp_origin'])  {
         throw new HttpException({
           status: HttpStatus.BAD_REQUEST,
           message: 'Los IDs son incorrectos.1',
         }, HttpStatus.BAD_REQUEST);
       }
       
       measurement_id = consulta[1]['measurement'].id_u_measurement
       dto.id_u_measurement= measurement_id
    } catch (e){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Los IDs son incorrectos.2',
      }, HttpStatus.BAD_REQUEST);
    }


    // Se validan datos repetidos
    if (property){
      const data = await this.connection
        .getRepository(entity)
        .createQueryBuilder('e')
        .where(`e.${property} = :dto`, {
          dto: dto[property]
        })
        .getOne();
      if (data) {
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'Este nombre ya ha sido registrado.',
        }, HttpStatus.FORBIDDEN);
      }
    }

    let row;
    // Inicia la una nueva conexión a la base de datos
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{
      // Se realiza la transacción
      row = await queryRunner.manager.save(entity, dto);
      await queryRunner.commitTransaction();
    } catch (error) {
      // No se pudo realizar la transacción
      await queryRunner.rollbackTransaction();
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: error!.response!.error ?? 'Error al crear un nuevo registro.',
      }, HttpStatus.FORBIDDEN);
    } finally {
      // Se cierra la conexión a la base de datos
      await queryRunner.release();
    }
    return row;
  }


  async patch(id:number, entity, dto, property, property_id){

    if (!isNaN(+id) && +id >= 1) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Contenido no encontrado.',
      }, HttpStatus.BAD_REQUEST);
    }

    let old_data = (await this.connection
        .getRepository(entity)
        .findByIds([id]))[0] as object;

    if (!old_data) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Contenido no encontrado.',
      }, HttpStatus.BAD_REQUEST);
    }

    // Se validan datos repetidos
    const data = await this.connection
      .getRepository(entity)
      .createQueryBuilder('e')
      .where(`e.${property} = :dto`, {
        dto: dto[property]
      })
      .getOne();

      
    if (data && data[property_id] != old_data[property_id]) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Este nombre ya ha sido registrado.',
      }, HttpStatus.FORBIDDEN);
    }

    // Asigna los valores
    old_data = {...old_data, ...dto};
    old_data['updated_at'] = new Date();

    // Se actualizan
    await this.connection.getRepository(entity).update(id, old_data);
    return await this.connection.getRepository(entity).findByIds([id])
  }

  async patchPrintfoot(id:number, entity, dto, property, property_id){

    if (!isNaN(+id) && +id <= 0) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Contenido no encontrado.',
      }, HttpStatus.BAD_REQUEST);
    }

     // Validación de los IDs
     let measurement_id;
     try {
        const consulta = await this.consultas(dto)
        
       if (consulta[2]['id_fp_category'] != consulta[0]['id_fp_category']  || consulta[2]['id_fp_origin'] != consulta[1]['id_fp_origin'])  {
         throw new HttpException({
           status: HttpStatus.BAD_REQUEST,
           message: 'Los IDs son incorrectos.1',
         }, HttpStatus.BAD_REQUEST);
       }
       
       measurement_id = consulta[1]['measurement'].id_u_measurement
       dto.id_u_measurement= measurement_id
     } catch (e){
       throw new HttpException({
         status: HttpStatus.BAD_REQUEST,
         message: 'Los IDs son incorrectos.2',
       }, HttpStatus.BAD_REQUEST);
     }

     
    let old_data = (await this.connection
        .getRepository(entity)
        .findByIds([id]))[0] as object;

    if (!old_data) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Contenido no encontrado.',
      }, HttpStatus.BAD_REQUEST);
    }

    // Asigna los valores
    old_data = {...old_data, ...dto};
    old_data['updated_at'] = new Date();

    // Se actualizan
    await this.connection.getRepository(entity).update(id, old_data);
    return await this.connection.getRepository(entity).findByIds([id])
  }


  async delete(id:number, entity){

    if (!isNaN(+id) && +id <= 0) {
      throw new HttpException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'No se pudo eliminar el registro.',
      }, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    
    try {
      const rows = await this.connection.getRepository(entity).findByIds([id])
      await this.connection.getRepository(entity).delete(rows);
      return 'Registo eliminado.'
    } catch(Exception) {
      throw new HttpException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'No se pudo eliminar el registro, tiene datos relacionados.',
      }, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }


  private async consultas(dto) {
    const category = await this.connection
    .getRepository(Categories)
    .createQueryBuilder('c')
    .where(`c.id_fp_category = :id`, {
      id: dto.id_fp_category
    })
    .getOneOrFail();

  const origin = await this.connection
    .getRepository(Origins)
    .createQueryBuilder('o')
    .innerJoinAndSelect('o.measurement', 'm', 'm.id_u_measurement = o.id_u_measurement')
    .where(`o.id_fp_origin = :id`, {
      id: dto.id_fp_origin
    })
    .getOneOrFail();

  const activity = await this.connection
    .getRepository(Activities)
    .createQueryBuilder('a')
    .where(`a.id_fp_category = :category AND a.id_fp_origin = :origin`, {
      category: category.id_fp_category,
      origin: origin.id_fp_origin
    })
    .getOneOrFail();
    return [category, origin, activity];
  }


  private pagination(page:number, items:number, total_items: object[]){
    // Se asigna valores por defecto para el numero de pagina y la cantidad de items
    if (isNaN(+page) || page <= 1){
      page = 0;
      } else {
        page -= 1;
      }
      if (isNaN(+items) || items < 0){
        items = 10;
      }
        
    // Obtiene el conteo de los registros
    const total_items_casted = total_items[0]['count'];
        
    // En este caso, si el número de registros que se piden es mayor al total de registros, se asigna el total de registros.
    if (items > total_items_casted){
      items = total_items_casted;
    }
        
    // Se calcula el número de ítems contados por medio del número de página y el número de registros que se está pidiendo.
    let itemCount = items * (page == 0 ? 1: (page + 1));
        
    // Se corrige el número de registros, la página en la que se encuentra actualmente y el número de registros contado.
    // En este caso en particular ocurre cuando se excede el número de páginas y se están consultando más ítems de los que hay.
    if (itemCount > total_items_casted) {
      items = total_items_casted
      page += 1
      itemCount = total_items_casted;
    }
    
    const total_pages = Math.round(total_items_casted/items)

    // Corrige el número, el número de página para que no se exceda el límite de páginas.
    // En este caso, si excede el límite de páginas, se fuerza a que la consulta exceda el número de 
    // y retorne cero registros.
    if (page > 0 && total_pages < page){
      page += 1
    }


    return {
      page: +page,
      items: +items,
      total_items_casted: total_items_casted,
      itemCount: itemCount,
      total_pages: total_pages
    }
  }

  // Formato del response con los metadatos de la paginación y los datos.
  private paginateMeta(endPointName:string, data, pagination_meta, page:number, search:string){
    // Se debe asignar automáticamente con variables de entorno, pero no hay producción :P
    const host_dev = 'localhost:80';
    const host_test = 'localhost:80';
    const host_prod = 'localhost:80';

    // Parámetros de URL
    const currentPage = +page == 0 || isNaN(page)? 1: +page;
    const previousPage = (currentPage - 1) == 0? 1: (currentPage - 1);
    const nextPage = (currentPage + 1)> pagination_meta.total_pages? pagination_meta.total_pages: (currentPage + 1);
    search = search?'&search=' + search.replace(' ', '%'): '';

    return{
      data: data,
      meta: {
        itemCount: pagination_meta.itemCount,
        totalItems: pagination_meta.total_items_casted,
        itemsPerPage: pagination_meta.items,
        totalPages: pagination_meta.total_pages,
        currentPage: currentPage
      },
      
      links : {
        first: `http://${host_dev}/api/footprint/${endPointName}?limit=${pagination_meta.items}${search}`,
        previous: `http://${host_dev}/api/footprint/${endPointName}?page=${previousPage?previousPage:1}&limit=${pagination_meta.items}${search}`,
        next: `http://${host_dev}/api/footprint/${endPointName}?page=${nextPage?nextPage:2}&limit=${pagination_meta.items}${search}`,
        last: `http://${host_dev}/api/footprint/${endPointName}?page=${pagination_meta.total_pages}&limit=${pagination_meta.items}${search}`
      }
    };
  }
}
