import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FilterOperator, PaginateQuery } from 'nestjs-paginate';
import { Connection } from 'typeorm';



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
    console.log(query)
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


  //TODO: POS,  PATH, DELETE
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
