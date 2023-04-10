import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FilterOperator, PaginateQuery } from 'nestjs-paginate';
import { Connection, getRepository } from 'typeorm';
import { Footprint } from './entities/footprint.entity';
import { Categories } from './entities/categories.entity';
import { Origins } from './entities/origins.entity';
import { Activities } from './entities/activities.entity';
import { Measurement } from './entities/measurement.entity';
import { month_constant, period_constant, quarter_constant, semester_constant, type_constant } from 'src/utils/constants';



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
           message: 'Los IDs son incorrectos.',
         }, HttpStatus.BAD_REQUEST);
       }
       
       measurement_id = consulta[1]['measurement'].id_u_measurement
       dto.id_u_measurement= measurement_id
    } catch (e){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Los IDs son incorrectos.',
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

    if (!isNaN(+id) && +id < 1) {
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
           message: 'Los IDs son incorrectos.',
         }, HttpStatus.BAD_REQUEST);
       }
       
       measurement_id = consulta[1]['measurement'].id_u_measurement
       dto.id_u_measurement= measurement_id
     } catch (e){
       throw new HttpException({
         status: HttpStatus.BAD_REQUEST,
         message: 'Los IDs son incorrectos.',
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

  async dashboard(
    categoryIds:string,
    originIds:string,
    activityIds:string,
    startDate:string,
    endDate:string,
    type:string,
    timePeriod:string
  ){
    
    // Se asigna el tipo de operación
 
    if (!type || type_constant.indexOf(type.toUpperCase()) < 0){
      type = type_constant[0];
    } else {
      type = type.toUpperCase();
    }

    // Periodo de tiempo
    if (!timePeriod || period_constant.indexOf(timePeriod.toUpperCase()) < 0){
      timePeriod = period_constant[0];
    } else {
      timePeriod = timePeriod.toUpperCase();
    }

    // Filtros necesarios

    if ((!categoryIds && !originIds && !activityIds) || !startDate) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Se necesitan 2 filtros, los cuales son la fecha inicial y un ID de cualquier categoría.',
      }, HttpStatus.BAD_REQUEST);
    }

    try {
      // Se cargan los catálogos en memoria
      const categoryWhere = categoryIds? `WHERE fc.id_fp_category IN (${categoryIds})` : '';
      const categories =  await this.connection.query(
        `SELECT category_name as name FROM footprint_categories fc ${categoryWhere}`
      ) as [];
      
      if (categories.length > 0) {
        
        const originWhere = originIds? `WHERE fo.id_fp_origin IN (${originIds})` : '';
        const activityWhere = activityIds? `WHERE a.id_activity IN (${activityIds})` : '';
        const origins =  await this.connection.query(
          `SELECT origin_name AS name FROM footprint_origins fo ${originWhere}`
        ) as [];
        const activities =  await this.connection.query(
          `SELECT activity_name AS name FROM activities a ${activityWhere}`
        ) as [];
        




        
        // Filtros de la consulta principal, join, group y order
        const dashboardQuery = await this.dashboardQuery(
          startDate, 
          endDate,
          categoryWhere,
          originWhere,
          activityWhere,
          timePeriod,
          type
          )






        // Formato del response 
        // Tomo como referencia las graficas "Stacked Bar" y "Pie" de la libreria Chart.js de PRIMENG
        let response = {
          labels: [],
          datasets: []
        };
        if (type == type_constant[0]) {

          // Grafico de barras
          // Label
          response.labels = dashboardQuery.new_time_axis;
          
          if (categoryIds) {
            response = this.bar_char(
              response, 
              categories, 
              'category', 
              dashboardQuery
              );
          }
          if (originIds && response.datasets.length == 0) {
            response = this.bar_char(
              response, 
              origins, 
              'origin', 
              dashboardQuery
              );
          }
          if (activityIds && response.datasets.length == 0) {
            response = this.bar_char(
              response, 
              activities, 
              'activity', 
              dashboardQuery
              );
          }

        } else {
          // Grafico de pastel
          // Label
          if (categoryIds ) {
            response = this.pie_chart(
              response, 
              categories, 
              'category',
              dashboardQuery
              );
          }
          if (originIds && response.labels.length == 0) {
            response = this.pie_chart(
              response, 
              origins, 
              'origin',
              dashboardQuery
              );
          }
          if (activityIds && response.labels.length == 0) {
            response = this.pie_chart(
              response, 
              activities, 
              'activity',
              dashboardQuery
              );
          }
        }

        //return dashboardQuery.footprint;
        return response;


      } else {
        throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'No se pudo encontrar registros.',
        }, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    } catch (e) {
      throw new HttpException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'No se pudo encontrar registros.',
      }, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  private async dashboardQuery(
    startDate:string, 
    endDate:string,
    categoryWhere:string,
    originWhere:string,
    activityWhere:string,
    timePeriod:string,
    type:string
    ){
    let footprintWhere = '';
    let fields = '';
    let innerJoin = '';
    let groupBy = '';
    const start_date = startDate? ` cf.created_at >= '${startDate}'`: '';
    const end_date = endDate? ` cf.created_at <= '${endDate}'`: '';
        
    if (start_date) {
      footprintWhere += start_date + ' ';
    }
    if (end_date) {
      if (footprintWhere) {
        footprintWhere += 'AND';
      }
      footprintWhere += end_date + ' ';
    }



    if (categoryWhere) {
      if (footprintWhere) {
        footprintWhere += 'AND';
      }
      footprintWhere += categoryWhere.replace('WHERE', '') + ' ';
      fields += `
        , fc.category_name AS category
        `;
      innerJoin += `
      INNER JOIN footprint_categories fc ON cf.id_fp_category = fc.id_fp_category 
        `;
      groupBy += `
         category
        `;
    }
    if (activityWhere) {
      if (footprintWhere) {
        footprintWhere += 'AND';
      }
      footprintWhere += activityWhere.replace('WHERE', '');
      fields += `
        ,a.activity_name AS activity
        `;
      innerJoin += `
        INNER JOIN activities a ON cf.id_activity = a.id_activity 
        `;

      if (groupBy) {
        groupBy += `
        , activity
        `;
      } else {
        groupBy += `
        activity
        `;
      }
    }
    if (originWhere || categoryWhere || activityWhere) {
      if (footprintWhere) {
        footprintWhere += 'AND';
      }
      footprintWhere += originWhere.replace('WHERE', '') + ' ';
      fields += `
        , fo.origin_name AS origin
        , um.measurement_name AS measurement
        `;
      innerJoin += `
        INNER JOIN footprint_origins fo ON cf.id_fp_origin  = fo.id_fp_origin
        INNER JOIN units_measurements um ON fo.id_u_measurement = um.id_u_measurement
        `;
      if (groupBy) {
        groupBy += `
        , origin
        , measurement
        `;
      } else {
        groupBy += `
        origin
        , measurement
        `;
      }
    }
    
    if (footprintWhere) {
      footprintWhere = 'WHERE' + footprintWhere;
    }
    let date_time = '';
    switch (timePeriod){
      // Mes
      case period_constant[0]:
        date_time = 'CAST(EXTRACT(MONTH FROM cf.created_at) AS INT)';
        break;
      // Trimestre
        
      case period_constant[1]:
        date_time = 'CAST(EXTRACT(QUARTER FROM cf.created_at) AS INT)';
        break;
      // Semestre
      case period_constant[2]:
        date_time = `
        CASE WHEN EXTRACT(MONTH FROM cf.created_at) <= 6
          THEN 1
          ELSE 2
        END `;
        break;
    }
        
    // Quita las fechas segun el tipo de graficos
    let base_group_order = '';
    if (type == type_constant[0]) {
      fields += `
        , CAST(EXTRACT(YEAR FROM cf.created_at) AS INT) AS year
        , CAST(${date_time} AS INT) AS date_time
      `;
      if (groupBy) {
        base_group_order = `
          year
          ,date_time,
        `;
      } else {
        base_group_order = `
          year
          ,date_time
        `;
      }
    }

    // Consulta datos pre-procesados
    const footprint =  await this.connection.query(
    `SELECT 
        sum(cf.quantity) AS total
        ${fields} 
      FROM carbono_footprints cf
      ${innerJoin}
      ${footprintWhere}
      GROUP BY
        ${base_group_order}
        ${groupBy}
      ORDER BY
        ${base_group_order}
        ${groupBy}
      asc;
      `
    ) as [];
    
    let new_time_axis;
    if (type == type_constant[0]) {
      const time_axis =  await this.connection.query(
        `SELECT 
          CAST(EXTRACT(YEAR FROM cf.created_at) AS INT) AS year,
          ${date_time} AS date_time
        FROM carbono_footprints cf
        ${innerJoin}
        ${footprintWhere}
        GROUP BY
          year,
          date_time
        ORDER BY
          year,
          date_time
        asc;
        `
      ) as [];

      new_time_axis = time_axis.map(item => {
        // Fechas
        switch (timePeriod) {
          case period_constant[0]:
            return item['year'] + ' - ' + month_constant[item['date_time'] - 1];
          
          case period_constant[1]:
            return item['year'] + ' - ' + quarter_constant[item['date_time'] - 1];
          
          case period_constant[2]:
            return item['year'] + ' - ' + semester_constant[item['date_time'] -1];
          
          default:
            return item['year'] + ' - ' + item['date_time'];
        }
      });
    }

    return {
      footprint: footprint,
      new_time_axis: new_time_axis
    }
  }

  private bar_char(response, query, field_name, dashboardQuery){
    // Se agrega la unidad de medida
    let init_data = []
    dashboardQuery.footprint.forEach(item => {
      init_data.push({
        name: item[field_name],
        time: item['date_time'],
        measure:item['measurement']
      })

    });
    init_data = init_data.filter((dato) => {
      const key = JSON.stringify(dato);
      return init_data.hasOwnProperty(key) ? false : (init_data[key] = true);
    });

    query.forEach(item => {
      const filtered_data = (init_data.filter(element => element.name === item['name'])).map(map_item => {
        return {
          parent_label: response.labels[map_item.time - 1],
          quantity: 0,
          measure: map_item.measure
        }
      });
      
      response.datasets.push({
        type: 'bar',
        label: item['name'],
        data: filtered_data
      });
    });

    // Se suman los datos
    dashboardQuery.footprint.forEach(item => { 
      const index = response.datasets.findIndex((object) => object.label === item[field_name]);
      const data_index = response.datasets[index]['data'].findIndex(object => object.measure === item['measurement']);
      response.datasets[index]['data'][data_index]['quantity'] += item['total']
    });
    return response;
  }

  private pie_chart(response, query, field_name, dashboardQuery){
    let total = 0;
    response.labels = query.map(item => {
      response.datasets.push(0);
      return item['name']
    });

    dashboardQuery.footprint.forEach(item => {
      response.datasets[response.labels.indexOf(item[field_name])] += item['total'];
      total += item['total'];
    });
    response.datasets = response.datasets.map(item => {
      return (item*100/total).toFixed(3) + '%';
    });
    return response;
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
