import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class Base1672768800000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // En esta tabla se almacenan los segmentos de las actividades.
        await queryRunner.createTable(new Table({
            name: "footprint_categories",
            columns: [
                {
                    name: 'id_fp_category',
                    type: "int",
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isPrimary: true
                },
                {
                    name: 'category_name',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'category_description',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    isNullable: true
                }
            ]
        }), true);

        await queryRunner.query(
            `
            INSERT INTO 
                footprint_categories(category_name, category_description) 
            VALUES 
                ('Emisiones directas','asociadas a las actividades de la organización y que están controladas por dicha organización.'),
                ('Emisiones indirectas','asociadas al consumo energético adquirido y consumido por la organización.'),
                ('Otras emisiones indirectas','asociadas a otras actividades no controladas por la organización.');
            `
        );
        
        // En esta tabla se almacenarán unidades de medidas.
        await queryRunner.createTable(new Table({
            name: "units_measurements",
            columns: [

                {
                    name: 'id_u_measurement',
                    type: "int",
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isPrimary: true
                },
                {
                    name: 'measurement_name',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'measurement_description',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    isNullable: true
                }
            ]
        }), true);

        await queryRunner.query(
            `
            INSERT INTO 
                units_measurements(measurement_name, measurement_description) 
            VALUES 
                ('Galon', ''),
                ('Kw', ''),
                ('Hojas', ''),
                ('Viajes', '');
            `
        );

        // En esta tabla se almacenarán los nombre del medio material que están generando huella de carbono.
        await queryRunner.createTable(new Table({
            name: "footprint_origins",
            columns: [

                {
                    name: 'id_fp_origin',
                    type: "int",
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isPrimary: true
                },
                {
                    name: 'origin_name',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'origin_description',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'id_u_measurement',
                    type: "int",
                    isNullable: false
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    isNullable: true
                }
            ]
        }), true);
        
        await queryRunner.createForeignKey("footprint_origins", new TableForeignKey({
            columnNames: ["id_u_measurement"],
            referencedColumnNames: ["id_u_measurement"],
            referencedTableName: "units_measurements"
        }));

        await queryRunner.query(
            `
            INSERT INTO 
                footprint_origins(origin_name, origin_description, id_u_measurement) 
            VALUES 
                ('Aceite', '', 1),
                ('Combustible', '', 1),
                ('Energia eléctrica ', '', 2),
                ('Papel', '', 3),
                ('Refrigerante', '', 1),
                ('Viajes', '', 4);
            `
        );

        // En esta tabla se almacenarán las actividades que están generando huella de carbono.
        await queryRunner.createTable(new Table({
            name: "activities",
            columns: [

                {
                    name: 'id_activity',
                    type: "int",
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isPrimary: true
                },
                {
                    name: 'activity_name',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'activity_description',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'id_fp_category',
                    type: "int",
                    isNullable: false
                },
                {
                    name: 'id_fp_origin',
                    type: "int",
                    isNullable: false
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    isNullable: true
                }
            ]
        }), true);
        
        await queryRunner.createForeignKey("activities", new TableForeignKey({
            columnNames: ["id_fp_category"],
            referencedColumnNames: ["id_fp_category"],
            referencedTableName: "footprint_categories"
        }));

        await queryRunner.createForeignKey("activities", new TableForeignKey({
            columnNames: ["id_fp_origin"],
            referencedColumnNames: ["id_fp_origin"],
            referencedTableName: "footprint_origins"
        }));

        await queryRunner.query(
            `
            INSERT INTO 
                activities(activity_name, activity_description, id_fp_category, id_fp_origin) 
            VALUES 
                ('Impresión de documentos', '', 1, 4),
                ('Mantenimiento de flota de distribución', '', 1, 1),
                ('Mantenimiento de maquinas operadoras', '', 1, 1),
                ('Perdida de gases refrigerante', '', 1, 5),
                ('Vehículos administrativos', '', 1, 2),
                ('Vehículos de distribución', '', 1, 2),
                ('Viajes del CEO Y COO', '', 1, 6),
                ('Viajes del equipo de ventas', '', 1, 6),
                ('Oficinas administrativas', '', 2, 3),
                ('Planta de envasado', '', 2, 3),
                ('Transporte tercero de materia prima', '', 3, 2);
            `
        );
  
        // En esta tabla se almacenarán unidades de medidas.
        await queryRunner.createTable(new Table({
            name: "carbono_footprints",
            columns: [

                {
                    name: 'id_c_footprints',
                    type: "int",
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isPrimary: true
                },
                {
                    name: 'quantity',
                    type: "float",
                    isNullable: false
                },
                {
                    name: 'note',
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: 'id_fp_category',
                    type: "int",
                    isNullable: false
                },
                {
                    name: 'id_activity',
                    type: "int",
                    isNullable: false
                },
                {
                    name: 'id_fp_origin',
                    type: "int",
                    isNullable: false
                },
                {
                    name: 'id_u_measurement',
                    type: "int",
                    isNullable: false
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    isNullable: true
                }
            ]
        }), true);
        
        await queryRunner.createForeignKey("carbono_footprints", new TableForeignKey({
            columnNames: ["id_fp_category"],
            referencedColumnNames: ["id_fp_category"],
            referencedTableName: "footprint_categories"
        }));

        await queryRunner.createForeignKey("carbono_footprints", new TableForeignKey({
            columnNames: ["id_activity"],
            referencedColumnNames: ["id_activity"],
            referencedTableName: "activities"
        }));

        await queryRunner.createForeignKey("carbono_footprints", new TableForeignKey({
            columnNames: ["id_fp_origin"],
            referencedColumnNames: ["id_fp_origin"],
            referencedTableName: "footprint_origins"
        }));

        await queryRunner.createForeignKey("carbono_footprints", new TableForeignKey({
            columnNames: ["id_u_measurement"],
            referencedColumnNames: ["id_u_measurement"],
            referencedTableName: "units_measurements"
        }));

        await queryRunner.query(
            `
            INSERT INTO 
                carbono_footprints(quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) 
            VALUES 
            (300.00 , '', 1, 1, 4, 3, '01-01-2023'),
            (1.00 , '', 1, 2, 1, 1, '01-01-2023'),
            (900.00 , '', 1, 3, 1, 1, '01-01-2023'),
            (3.00 , '', 1, 4, 5, 1, '01-01-2023'),
            (750.00 , '', 1, 5, 2, 1, '01-01-2023'),
            (1250.00 , '', 1, 6, 2, 1, '01-01-2023'),
            (3.00 , '', 1, 7, 6, 4, '01-01-2023'),
            (2.00 , '', 1, 8, 6, 4, '01-01-2023'),
            (300.00 , '', 2, 9, 3, 2, '01-01-2023'),
            (900.00 , '', 2, 10, 3, 2, '01-01-2023'),
            (500.00 , '', 3, 11, 2, 1, '01-01-2023');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (438, 'Fionnula', 3, 1, 6, 1, '6/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (279, 'Marya', 1, 9, 2, 4, '2/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (48, 'Dominica', 1, 3, 1, 3, '5/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (42, 'Rancell', 1, 9, 4, 2, '11/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (56, 'Correy', 3, 8, 1, 1, '8/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (248, 'Rickey', 1, 8, 2, 3, '7/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (411, 'Coop', 1, 7, 4, 3, '8/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (288, 'Hunfredo', 2, 3, 1, 4, '1/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (502, 'Cindelyn', 3, 11, 5, 2, '6/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (125, 'Beverly', 3, 4, 1, 4, '4/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (580, 'Julius', 2, 10, 4, 1, '1/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (45, 'Bradan', 1, 9, 6, 3, '5/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (581, 'Cherlyn', 3, 1, 2, 4, '3/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (106, 'Loralee', 2, 5, 5, 3, '8/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (561, 'Rafaelita', 3, 4, 1, 1, '5/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (174, 'Jacquetta', 1, 6, 6, 2, '4/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (910, 'Barrie', 2, 10, 1, 3, '7/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (139, 'Bee', 2, 5, 5, 1, '10/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (257, 'Rubin', 1, 11, 3, 4, '1/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (18, 'Catrina', 3, 11, 4, 2, '7/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (987, 'Christy', 3, 2, 3, 1, '11/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (898, 'Andre', 3, 4, 2, 4, '3/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (729, 'Vale', 3, 9, 1, 3, '8/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (279, 'Camel', 3, 8, 2, 2, '1/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (841, 'Augustina', 1, 4, 6, 3, '10/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (274, 'Birgitta', 2, 10, 6, 4, '3/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (621, 'Cassie', 3, 5, 2, 1, '9/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (570, 'Earle', 1, 5, 2, 2, '5/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (650, 'Armando', 3, 9, 3, 3, '8/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (370, 'Holly', 3, 4, 6, 1, '11/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (365, 'Skylar', 1, 8, 5, 3, '9/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (555, 'Christie', 3, 11, 3, 2, '1/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (357, 'Tuesday', 1, 9, 2, 2, '6/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (389, 'Alasdair', 3, 8, 5, 2, '4/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (335, 'Valentina', 1, 5, 6, 4, '6/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (112, 'Dalton', 2, 11, 3, 1, '4/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (310, 'Amery', 3, 10, 6, 2, '2/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (654, 'Davita', 1, 5, 4, 3, '2/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (327, 'Hastings', 3, 7, 1, 4, '7/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (25, 'Orelie', 1, 10, 3, 1, '6/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (709, 'Kattie', 2, 7, 4, 4, '10/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (250, 'Anna-diana', 3, 5, 4, 2, '5/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (864, 'Shawn', 1, 5, 4, 3, '3/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (235, 'Eddi', 3, 2, 1, 4, '12/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (207, 'Jourdan', 3, 11, 3, 4, '10/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (24, 'Maximilien', 2, 2, 6, 3, '1/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (132, 'Georgette', 3, 5, 5, 4, '7/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (571, 'Valdemar', 2, 5, 4, 1, '9/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (896, 'Margot', 1, 5, 4, 2, '11/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (748, 'Gabriele', 2, 5, 4, 3, '12/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (916, 'Modesta', 2, 9, 2, 1, '2/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (597, 'Malva', 3, 8, 6, 2, '9/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (585, 'Verile', 3, 10, 3, 2, '4/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (305, 'Daisi', 2, 7, 5, 2, '4/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (695, 'Josy', 3, 9, 4, 2, '6/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (189, 'Pieter', 3, 8, 1, 3, '7/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (60, 'Lucila', 3, 6, 4, 4, '11/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (360, 'Eulalie', 3, 11, 1, 4, '12/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (500, 'Davie', 2, 1, 2, 1, '4/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (760, 'Rand', 2, 5, 4, 3, '7/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (133, 'Hamnet', 1, 7, 5, 4, '11/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (56, 'Abner', 3, 4, 2, 2, '7/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (710, 'Kiley', 2, 1, 4, 2, '1/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (765, 'Ailey', 2, 3, 1, 4, '7/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (651, 'Granger', 2, 7, 1, 2, '11/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (704, 'Corette', 1, 2, 3, 2, '9/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (563, 'Danette', 2, 3, 2, 2, '12/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (284, 'Diena', 3, 1, 1, 3, '4/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (168, 'Storm', 1, 7, 6, 2, '10/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (580, 'Clemmy', 3, 8, 4, 4, '12/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (968, 'Brendis', 1, 6, 3, 4, '8/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (444, 'Andie', 2, 2, 2, 3, '6/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (482, 'Zebedee', 1, 5, 5, 1, '11/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (861, 'Killy', 2, 1, 2, 2, '7/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (978, 'Steward', 2, 2, 1, 1, '8/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (881, 'Silvanus', 3, 9, 6, 3, '10/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (553, 'Valery', 3, 3, 3, 2, '5/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (715, 'Hazel', 1, 3, 6, 1, '12/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (20, 'Brittan', 2, 10, 3, 3, '8/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (166, 'Talyah', 2, 7, 6, 2, '2/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (364, 'Irvine', 2, 6, 5, 3, '8/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (207, 'Ingram', 2, 10, 4, 1, '11/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (498, 'Darb', 2, 8, 2, 1, '1/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (639, 'Thorstein', 2, 5, 6, 1, '12/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (109, 'Dion', 3, 9, 2, 4, '8/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (708, 'Leonore', 2, 11, 2, 3, '4/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (741, 'Tabb', 1, 10, 6, 4, '11/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (719, 'Linnie', 3, 5, 6, 3, '3/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (480, 'Sven', 2, 11, 1, 1, '1/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (550, 'Emelita', 1, 9, 4, 2, '4/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (545, 'Griswold', 2, 3, 4, 3, '1/31/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (989, 'Chariot', 1, 11, 4, 4, '2/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (976, 'Ealasaid', 3, 1, 5, 2, '3/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (403, 'Bibbie', 3, 10, 1, 2, '8/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (204, 'Penn', 3, 7, 5, 2, '9/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (605, 'Ailis', 1, 8, 5, 4, '9/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (763, 'Toddie', 2, 6, 1, 4, '11/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (366, 'Joline', 2, 6, 1, 3, '5/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (442, 'Layla', 2, 11, 6, 2, '6/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (236, 'Lauralee', 1, 1, 6, 4, '5/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (302, 'Sigvard', 1, 4, 3, 3, '2/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (764, 'Reube', 1, 6, 4, 2, '11/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (680, 'Haily', 3, 7, 1, 4, '8/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (465, 'Ransom', 3, 9, 6, 3, '9/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (855, 'Alwyn', 3, 5, 5, 1, '6/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (381, 'Wolfy', 1, 4, 1, 3, '2/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (665, 'Ty', 1, 8, 4, 3, '9/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (212, 'Benjamin', 1, 11, 4, 3, '1/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (964, 'Dorthy', 2, 9, 3, 3, '2/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (848, 'Geralda', 1, 2, 1, 1, '7/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (864, 'Orazio', 2, 1, 4, 1, '10/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (401, 'Edythe', 1, 2, 4, 3, '5/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (354, 'Izaak', 1, 2, 3, 3, '1/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (267, 'Noby', 2, 6, 5, 2, '11/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (935, 'Elmer', 1, 11, 5, 2, '10/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (464, 'Katerine', 1, 3, 6, 1, '7/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (445, 'Gus', 3, 10, 2, 3, '5/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (164, 'Jase', 2, 8, 4, 4, '12/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (831, 'Ailene', 1, 2, 6, 3, '2/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (267, 'Yorker', 1, 5, 5, 1, '7/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (446, 'Bailey', 3, 9, 6, 4, '4/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (957, 'Carlyle', 2, 8, 3, 3, '6/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (936, 'Holden', 3, 10, 3, 1, '6/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (533, 'Ladonna', 2, 7, 6, 4, '8/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (690, 'Ware', 2, 7, 5, 3, '5/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (105, 'Dory', 1, 6, 2, 3, '12/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (172, 'Kerwin', 2, 7, 1, 3, '8/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (813, 'Jeni', 3, 8, 5, 1, '11/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (554, 'Cletis', 1, 5, 4, 1, '8/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (128, 'Jedidiah', 3, 7, 5, 3, '2/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (393, 'Dermot', 1, 8, 1, 3, '3/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (197, 'Sloan', 2, 2, 3, 1, '11/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (746, 'Pavlov', 2, 7, 6, 4, '5/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (44, 'Sanderson', 3, 9, 1, 4, '11/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (106, 'Dimitry', 3, 4, 3, 3, '3/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (654, 'Russell', 2, 2, 2, 3, '3/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (385, 'Ade', 3, 3, 3, 3, '4/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (59, 'Walton', 3, 8, 2, 2, '8/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (817, 'Aloysia', 3, 9, 3, 2, '11/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (721, 'Meggie', 2, 4, 6, 4, '5/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (457, 'Gui', 3, 5, 3, 2, '1/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (798, 'Nils', 1, 1, 3, 3, '9/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (789, 'Prudence', 1, 11, 3, 1, '8/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (376, 'Stella', 2, 5, 4, 3, '1/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (265, 'Derril', 2, 10, 5, 2, '9/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (275, 'Tarra', 2, 1, 6, 1, '2/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (944, 'Darell', 3, 11, 5, 1, '12/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (848, 'Kahlil', 2, 7, 5, 1, '11/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (407, 'Shanta', 2, 11, 3, 2, '10/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (433, 'Letty', 1, 8, 4, 3, '11/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (524, 'Alberto', 3, 9, 6, 3, '8/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (833, 'Ivar', 2, 6, 4, 2, '9/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (182, 'Antony', 1, 7, 3, 3, '6/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (613, 'Josie', 3, 5, 5, 2, '1/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (20, 'Lynsey', 3, 7, 2, 3, '8/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (383, 'Martyn', 2, 7, 2, 1, '3/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (991, 'Karoline', 2, 1, 2, 1, '8/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (114, 'Kath', 3, 10, 1, 2, '5/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (885, 'Darill', 3, 9, 1, 4, '2/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (545, 'Lauryn', 3, 3, 3, 3, '7/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (23, 'Krystalle', 2, 11, 1, 3, '3/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (885, 'Jerrold', 2, 1, 3, 4, '5/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (295, 'Abbie', 1, 11, 4, 3, '8/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (27, 'Chase', 1, 9, 3, 2, '12/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (264, 'Roshelle', 2, 11, 5, 3, '1/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (907, 'Dina', 3, 6, 1, 4, '12/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (670, 'Lorianne', 2, 2, 2, 2, '10/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (563, 'Lexie', 3, 8, 5, 1, '9/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (396, 'Gladi', 1, 1, 2, 1, '9/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (683, 'Terrance', 3, 7, 6, 3, '5/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (498, 'Eleonore', 3, 1, 4, 3, '11/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (762, 'Manny', 2, 4, 1, 4, '8/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (226, 'Barnard', 1, 5, 4, 1, '10/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (890, 'Pippy', 3, 6, 2, 2, '3/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (429, 'Viki', 1, 6, 6, 3, '7/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (572, 'Toby', 1, 10, 4, 2, '5/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (695, 'Timmy', 2, 5, 1, 1, '6/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (338, 'Ilaire', 1, 10, 6, 1, '12/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (693, 'Sascha', 2, 5, 6, 1, '4/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (588, 'Minny', 1, 5, 3, 1, '4/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (131, 'Micky', 2, 8, 5, 3, '9/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (833, 'Axe', 3, 5, 3, 4, '11/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (541, 'Sybyl', 1, 4, 3, 2, '10/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (711, 'Julieta', 2, 7, 4, 2, '5/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (737, 'Dawn', 1, 9, 1, 4, '6/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (742, 'Marlo', 1, 6, 4, 3, '12/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (419, 'Haleigh', 2, 1, 1, 4, '4/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (188, 'Caressa', 3, 3, 5, 3, '3/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (733, 'Lorant', 1, 8, 2, 4, '12/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (411, 'Sandye', 3, 3, 4, 3, '8/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (209, 'Kingsley', 3, 4, 3, 4, '8/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (639, 'Jasun', 3, 2, 2, 4, '1/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (926, 'Lanita', 2, 4, 3, 2, '3/31/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (449, 'Jeff', 3, 3, 1, 4, '7/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (494, 'Letisha', 3, 3, 4, 2, '4/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (251, 'Ludvig', 1, 1, 3, 2, '9/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (670, 'Shir', 1, 5, 6, 4, '5/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (460, 'Marilee', 2, 11, 4, 4, '7/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (747, 'Denney', 3, 4, 5, 1, '10/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (145, 'Osmond', 3, 9, 2, 4, '3/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (604, 'Ardenia', 1, 11, 5, 3, '5/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (30, 'Friedrick', 2, 4, 1, 2, '1/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (463, 'Gordy', 2, 2, 6, 4, '7/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (903, 'Coleen', 1, 7, 2, 1, '7/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (787, 'Danella', 3, 4, 5, 4, '11/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (12, 'Bibbye', 3, 1, 1, 3, '3/31/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (908, 'Evelyn', 3, 5, 2, 3, '12/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (162, 'Kathe', 1, 11, 3, 4, '5/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (176, 'Jane', 2, 4, 6, 1, '2/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (513, 'Dawn', 2, 1, 4, 2, '11/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (195, 'Baudoin', 1, 1, 4, 2, '6/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (318, 'Cathi', 2, 6, 1, 4, '3/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (814, 'Nancey', 1, 9, 4, 2, '5/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (969, 'Daisey', 2, 10, 3, 1, '8/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (19, 'Tabatha', 2, 10, 3, 1, '5/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (781, 'Berna', 1, 5, 1, 4, '8/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (678, 'Camey', 2, 9, 1, 2, '1/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (713, 'Fabien', 1, 8, 2, 2, '10/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (965, 'Bronny', 1, 8, 4, 1, '4/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (408, 'Egbert', 3, 5, 1, 3, '8/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (977, 'Cheston', 1, 11, 2, 3, '1/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (89, 'Allix', 2, 3, 5, 3, '9/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (701, 'Joella', 3, 2, 6, 2, '3/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (969, 'Haley', 3, 2, 1, 3, '1/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (783, 'Sheryl', 2, 7, 1, 2, '9/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (383, 'Evangelin', 3, 6, 6, 1, '8/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (406, 'Therine', 3, 8, 5, 4, '12/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (525, 'Antons', 1, 2, 6, 4, '6/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (887, 'Valerie', 3, 6, 4, 1, '3/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (201, 'Davina', 2, 9, 2, 4, '2/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (784, 'Ker', 3, 8, 5, 1, '7/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (98, 'Berni', 1, 9, 4, 4, '2/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (359, 'Greta', 2, 1, 3, 3, '8/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (652, 'Lacey', 1, 1, 2, 4, '1/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (582, 'Jillana', 1, 3, 6, 2, '4/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (99, 'Shoshana', 2, 1, 3, 3, '12/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (592, 'Dorris', 3, 7, 2, 3, '6/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (444, 'Amalita', 3, 7, 2, 2, '10/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (403, 'Milly', 2, 1, 6, 4, '5/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (405, 'Jarrod', 1, 8, 2, 1, '1/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (936, 'Roderick', 1, 2, 5, 2, '2/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (870, 'Kit', 3, 9, 4, 2, '10/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (765, 'Kev', 3, 3, 1, 2, '1/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (880, 'Caterina', 3, 11, 3, 3, '9/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (561, 'Oberon', 1, 2, 5, 2, '11/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (240, 'Gwenny', 3, 7, 2, 3, '5/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (77, 'Hallsy', 2, 6, 5, 4, '8/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (140, 'Hans', 1, 8, 4, 2, '6/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (955, 'Ardra', 1, 6, 6, 4, '12/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (865, 'Sylas', 3, 1, 3, 3, '7/31/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (60, 'Kaia', 1, 3, 6, 2, '12/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (977, 'Birch', 1, 10, 6, 3, '4/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (837, 'Sloan', 2, 1, 1, 3, '6/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (865, 'Berni', 3, 6, 6, 4, '9/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (495, 'Theda', 1, 3, 3, 4, '3/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (567, 'Cherlyn', 3, 7, 3, 4, '6/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (72, 'Obadias', 2, 8, 6, 2, '2/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (679, 'Deirdre', 2, 2, 3, 4, '10/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (5, 'Reese', 1, 3, 4, 3, '8/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (433, 'Rupert', 1, 7, 3, 1, '7/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (842, 'Vevay', 2, 4, 5, 2, '7/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (855, 'Pavlov', 3, 5, 1, 2, '5/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (908, 'Galina', 1, 1, 6, 2, '6/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (423, 'Sanson', 2, 5, 4, 1, '8/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (349, 'Bette', 2, 6, 2, 4, '7/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (762, 'Cherin', 1, 5, 1, 2, '5/31/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (753, 'Bordy', 1, 5, 5, 3, '12/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (505, 'Lovell', 1, 7, 5, 2, '7/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (295, 'Quill', 2, 2, 2, 2, '4/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (789, 'Dacia', 2, 6, 4, 2, '7/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (886, 'Hewe', 3, 10, 2, 4, '12/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (432, 'Luella', 3, 4, 2, 1, '9/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (446, 'Guendolen', 3, 8, 1, 3, '8/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (18, 'Biron', 2, 9, 4, 1, '5/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (455, 'Artie', 2, 1, 6, 3, '8/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (929, 'Siegfried', 1, 4, 5, 2, '10/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (793, 'Stephine', 2, 5, 6, 2, '3/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (573, 'Rozamond', 3, 1, 5, 3, '7/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (786, 'Belvia', 1, 8, 2, 3, '9/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (297, 'Frank', 2, 2, 3, 3, '8/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (61, 'Hobard', 3, 10, 1, 4, '12/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (380, 'Cassandra', 2, 6, 5, 2, '5/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (818, 'See', 2, 5, 6, 1, '10/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (571, 'Jefferey', 1, 11, 2, 2, '7/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (432, 'Jared', 2, 10, 5, 2, '6/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (141, 'Gale', 1, 3, 3, 1, '3/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (38, 'Katha', 3, 5, 2, 2, '11/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (512, 'Issi', 1, 11, 4, 3, '7/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (87, 'Morgan', 2, 6, 2, 1, '1/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (256, 'Woodrow', 2, 8, 2, 2, '9/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (683, 'Carmon', 1, 4, 3, 1, '11/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (420, 'Noak', 1, 6, 6, 2, '3/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (125, 'Maryanna', 1, 6, 2, 3, '8/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (599, 'Reeta', 2, 9, 6, 2, '7/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (90, 'Georgeanne', 3, 8, 4, 1, '8/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (135, 'Earl', 3, 10, 3, 1, '10/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (504, 'Theresa', 1, 10, 4, 3, '4/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (85, 'Allsun', 1, 7, 3, 1, '2/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (58, 'Kimble', 1, 9, 1, 1, '1/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (982, 'Crin', 1, 1, 2, 2, '1/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (134, 'Belle', 1, 6, 2, 4, '12/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (693, 'Rosemarie', 3, 4, 3, 1, '2/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (540, 'Tim', 1, 3, 1, 3, '11/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (147, 'Jaymie', 3, 9, 1, 2, '6/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (996, 'Charline', 1, 4, 5, 2, '10/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (466, 'Elspeth', 2, 7, 3, 2, '5/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (571, 'Brocky', 2, 10, 4, 2, '10/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (730, 'Chrystal', 3, 10, 2, 4, '4/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (611, 'Allistir', 3, 2, 6, 4, '2/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (411, 'Ranice', 3, 8, 1, 2, '3/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (455, 'Llewellyn', 1, 3, 2, 4, '5/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (429, 'Shelley', 1, 9, 4, 3, '1/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (225, 'Trevor', 3, 1, 6, 4, '9/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (452, 'Derrick', 2, 11, 6, 1, '9/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (641, 'Normand', 1, 9, 6, 4, '12/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (290, 'Sarge', 3, 11, 5, 4, '12/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (399, 'Eugenio', 1, 5, 3, 2, '7/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (579, 'Fredia', 1, 8, 5, 2, '8/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (991, 'Lolly', 1, 8, 4, 2, '3/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (599, 'Genevieve', 1, 4, 4, 2, '8/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (875, 'Dniren', 3, 7, 5, 3, '10/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (516, 'Verna', 3, 3, 5, 1, '7/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (516, 'Paton', 1, 6, 3, 4, '6/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (998, 'Anselma', 2, 11, 6, 1, '8/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (646, 'Drake', 1, 4, 1, 2, '9/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (294, 'Alonso', 1, 9, 4, 4, '10/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (811, 'Josie', 1, 4, 2, 1, '5/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (763, 'Georgy', 3, 11, 3, 2, '11/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (586, 'Judd', 1, 6, 2, 3, '3/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (399, 'Joanie', 1, 4, 2, 1, '10/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (593, 'Annabal', 3, 5, 2, 3, '9/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (925, 'Friederike', 3, 5, 2, 3, '4/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (631, 'Amalee', 3, 4, 2, 3, '1/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (973, 'Theodore', 3, 9, 4, 3, '9/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (87, 'Trudi', 2, 1, 4, 4, '1/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (480, 'Tadio', 2, 11, 6, 2, '2/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (201, 'Harv', 2, 1, 5, 4, '3/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (685, 'Domini', 2, 1, 5, 2, '1/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (582, 'Leona', 1, 7, 6, 2, '2/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (345, 'Moria', 1, 11, 3, 3, '4/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (222, 'Melodee', 1, 5, 1, 3, '6/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (282, 'Sharron', 3, 7, 2, 3, '10/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (926, 'Marion', 1, 6, 6, 4, '11/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (944, 'Alanah', 1, 8, 3, 3, '9/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (629, 'Emmery', 3, 5, 5, 2, '9/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (421, 'Garner', 2, 2, 1, 1, '11/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (643, 'Idette', 2, 11, 6, 3, '1/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (19, 'Curr', 3, 6, 2, 4, '5/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (489, 'Evvy', 2, 2, 5, 1, '12/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (24, 'Karen', 2, 11, 2, 4, '12/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (453, 'Hildegarde', 3, 2, 5, 3, '9/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (896, 'Aleen', 1, 11, 3, 3, '11/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (516, 'Millicent', 3, 1, 5, 1, '12/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (348, 'Elfie', 2, 9, 5, 1, '7/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (611, 'Carlen', 2, 2, 4, 3, '9/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (584, 'Fidel', 3, 9, 6, 2, '2/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (202, 'Erma', 2, 3, 6, 2, '8/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (252, 'Rosanna', 2, 8, 4, 4, '10/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (837, 'Kiley', 2, 11, 1, 2, '4/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (479, 'Misty', 2, 10, 5, 2, '12/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (267, 'Jarib', 1, 5, 1, 4, '1/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (22, 'Teri', 2, 9, 5, 2, '8/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (567, 'Ashlee', 1, 5, 5, 4, '5/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (544, 'Pincas', 2, 8, 6, 2, '4/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (414, 'Opalina', 2, 1, 1, 3, '9/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (996, 'Ollie', 2, 7, 4, 3, '6/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (705, 'Susann', 3, 5, 1, 4, '7/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (686, 'Farah', 3, 2, 3, 2, '4/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (493, 'Huberto', 1, 11, 3, 2, '6/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (839, 'Abey', 1, 7, 6, 2, '5/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (791, 'Eadie', 3, 2, 4, 3, '12/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (154, 'Tomasine', 2, 8, 6, 1, '5/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (689, 'Lana', 3, 11, 1, 1, '5/31/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (100, 'Grayce', 1, 7, 4, 1, '6/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (790, 'Janenna', 1, 4, 4, 3, '10/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (984, 'Filberto', 1, 6, 6, 4, '6/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (270, 'Jeth', 1, 5, 1, 3, '8/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (530, 'Jakob', 1, 10, 4, 1, '11/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (408, 'Julianne', 2, 5, 6, 1, '5/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (105, 'Charley', 2, 3, 5, 3, '9/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (625, 'Renard', 2, 3, 3, 1, '11/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (713, 'Martica', 2, 6, 1, 3, '9/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (930, 'Malory', 3, 10, 4, 4, '11/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (928, 'Monika', 3, 9, 2, 3, '3/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (605, 'Ilyssa', 1, 3, 1, 3, '4/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (392, 'Kermit', 3, 4, 5, 3, '8/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (450, 'Pip', 3, 5, 3, 1, '9/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (329, 'Noll', 3, 2, 3, 4, '7/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (23, 'Bayard', 3, 1, 3, 3, '5/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (826, 'Lois', 3, 3, 1, 3, '5/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (354, 'Lesya', 3, 5, 5, 2, '12/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (694, 'Marcy', 2, 5, 1, 2, '3/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (781, 'Ezekiel', 1, 9, 6, 4, '4/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (27, 'Aymer', 1, 7, 5, 2, '8/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (239, 'Joana', 2, 5, 2, 2, '10/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (865, 'Cloe', 1, 6, 5, 4, '11/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (753, 'Melodee', 1, 8, 5, 4, '5/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (428, 'Reta', 1, 4, 6, 2, '5/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (666, 'Iggie', 2, 9, 1, 4, '7/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (523, 'Eunice', 3, 10, 3, 3, '1/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (461, 'Allen', 2, 10, 5, 1, '6/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (67, 'Lurette', 1, 4, 3, 1, '8/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (655, 'Payton', 1, 9, 2, 4, '8/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (716, 'Merry', 1, 9, 5, 1, '5/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (80, 'Nigel', 2, 11, 1, 4, '11/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (964, 'Celle', 1, 11, 1, 2, '11/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (993, 'Lorinda', 3, 3, 6, 4, '6/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (712, 'Elspeth', 1, 6, 5, 4, '12/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (914, 'Ardelia', 2, 2, 5, 1, '4/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (427, 'Gal', 1, 7, 2, 3, '12/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (997, 'Jerrome', 3, 2, 3, 1, '6/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (823, 'Lanae', 2, 1, 3, 2, '1/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (508, 'Tarah', 3, 10, 6, 1, '2/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (708, 'Leandra', 3, 4, 6, 4, '4/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (679, 'Ev', 2, 5, 5, 2, '7/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (606, 'Micky', 3, 3, 4, 1, '4/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (635, 'Jemmy', 3, 9, 1, 3, '11/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (830, 'Clemmy', 1, 5, 4, 3, '1/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (888, 'Micheal', 3, 9, 1, 2, '8/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (477, 'Natty', 1, 10, 1, 4, '9/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (890, 'Joscelin', 2, 2, 1, 4, '7/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (419, 'Darelle', 1, 7, 1, 1, '9/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (191, 'Averil', 3, 10, 4, 3, '2/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (541, 'Veronique', 1, 9, 3, 1, '11/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (78, 'Faunie', 3, 1, 1, 2, '3/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (343, 'Katerina', 1, 8, 6, 4, '10/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (603, 'Orin', 2, 10, 1, 2, '5/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (248, 'Goran', 2, 5, 3, 1, '2/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (946, 'Ronnie', 1, 10, 4, 2, '4/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (61, 'Nels', 3, 7, 3, 2, '12/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (840, 'Alexandro', 3, 6, 4, 3, '3/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (957, 'Doloritas', 3, 1, 1, 3, '7/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (916, 'Chip', 3, 2, 3, 4, '1/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (818, 'Cathy', 1, 8, 3, 3, '11/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (359, 'Killie', 2, 8, 3, 4, '7/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (791, 'Brockie', 2, 4, 4, 3, '2/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (769, 'Laurene', 1, 3, 1, 4, '8/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (603, 'Woodman', 2, 1, 3, 4, '5/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (94, 'Dynah', 3, 3, 1, 2, '10/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (42, 'Amandi', 2, 11, 3, 1, '7/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (442, 'Sim', 2, 1, 4, 2, '1/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (49, 'Arch', 1, 6, 5, 3, '11/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (487, 'Gertrud', 1, 6, 5, 4, '11/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (371, 'Barrett', 3, 9, 3, 4, '4/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (993, 'Mariel', 1, 10, 1, 2, '6/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (463, 'Murdock', 3, 4, 5, 3, '3/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (248, 'Larry', 1, 5, 4, 1, '10/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (562, 'Kyle', 1, 5, 1, 4, '12/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (860, 'Lydia', 3, 8, 2, 1, '7/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (861, 'Vanni', 3, 10, 3, 2, '3/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (242, 'Othello', 3, 9, 3, 4, '11/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (589, 'Gigi', 3, 8, 5, 2, '7/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (94, 'Basilius', 1, 5, 3, 3, '11/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (685, 'Moore', 2, 9, 4, 3, '12/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (324, 'Darice', 1, 3, 5, 2, '11/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (329, 'Anjela', 1, 3, 6, 4, '6/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (894, 'Nappie', 2, 6, 2, 4, '10/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (282, 'Morley', 3, 10, 1, 2, '1/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (449, 'Niel', 1, 2, 6, 3, '4/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (527, 'Seamus', 3, 9, 1, 2, '11/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (604, 'Minni', 2, 3, 6, 1, '4/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (667, 'Aldridge', 1, 5, 4, 3, '1/31/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (854, 'Keary', 1, 11, 1, 2, '2/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (836, 'Riordan', 1, 1, 4, 4, '7/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (338, 'Norton', 1, 8, 3, 2, '2/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (907, 'Eryn', 1, 5, 5, 1, '10/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (224, 'Hayes', 2, 4, 4, 1, '6/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (800, 'Roxanna', 1, 8, 3, 1, '7/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (355, 'Bobette', 2, 10, 4, 2, '1/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (190, 'Gerhardt', 3, 11, 6, 2, '12/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (511, 'Marlee', 3, 4, 6, 1, '8/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (242, 'Sancho', 2, 2, 1, 1, '5/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (135, 'Perkin', 2, 6, 5, 4, '4/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (745, 'Nevin', 3, 6, 5, 2, '3/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (399, 'Clerissa', 1, 4, 2, 4, '8/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (841, 'Christophe', 1, 3, 1, 3, '12/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (315, 'Hastie', 3, 2, 6, 4, '5/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (863, 'Alison', 3, 3, 4, 3, '6/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (39, 'Eolande', 2, 6, 6, 4, '1/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (440, 'Bebe', 2, 8, 4, 1, '8/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (707, 'Lindsey', 1, 1, 1, 1, '10/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (867, 'Dominique', 1, 4, 4, 2, '12/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (257, 'Jazmin', 1, 9, 1, 3, '5/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (243, 'Ofilia', 2, 1, 4, 2, '6/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (741, 'Farlee', 3, 8, 5, 4, '6/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (789, 'Timotheus', 3, 2, 5, 4, '12/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (904, 'Benedicta', 3, 7, 5, 2, '7/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (580, 'Jaynell', 2, 9, 6, 3, '1/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (198, 'Artus', 3, 7, 4, 3, '6/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (129, 'Noland', 3, 5, 5, 2, '7/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (601, 'Darwin', 3, 5, 2, 3, '6/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (142, 'Brietta', 2, 1, 5, 4, '4/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (886, 'Alessandro', 1, 11, 3, 2, '9/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (238, 'Elisa', 1, 9, 5, 3, '4/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (777, 'Ashlin', 2, 9, 6, 2, '12/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (14, 'Jeanine', 3, 4, 3, 1, '2/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (549, 'Benito', 1, 7, 6, 3, '8/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (84, 'Cassaundra', 2, 10, 4, 4, '4/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (271, 'Godfry', 2, 1, 5, 2, '10/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (638, 'Vincenty', 2, 8, 5, 1, '3/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (149, 'Pru', 1, 5, 6, 2, '3/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (196, 'Tansy', 1, 6, 6, 4, '9/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (248, 'Zora', 2, 6, 1, 3, '2/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (830, 'Anson', 1, 1, 4, 3, '11/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (110, 'Mira', 3, 2, 4, 4, '4/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (592, 'Irma', 2, 3, 4, 4, '4/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (488, 'Eberto', 3, 9, 6, 2, '6/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (591, 'Felipe', 2, 11, 6, 4, '11/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (144, 'Nicola', 3, 2, 5, 1, '9/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (77, 'Cherilynn', 2, 8, 1, 2, '10/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (419, 'Marcelo', 2, 2, 4, 1, '8/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (437, 'Cissy', 3, 6, 1, 1, '9/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (517, 'Moore', 3, 7, 4, 4, '2/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (533, 'Marlane', 3, 6, 2, 1, '4/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (149, 'Nisse', 3, 3, 4, 4, '2/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (112, 'Halie', 2, 7, 3, 2, '9/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (472, 'Kyle', 1, 7, 5, 3, '4/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (996, 'Bert', 2, 8, 5, 3, '3/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (262, 'Jenn', 1, 5, 3, 2, '11/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (555, 'Carolynn', 2, 6, 1, 4, '6/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (857, 'Ynes', 1, 7, 1, 1, '6/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (565, 'Arnie', 2, 2, 5, 1, '5/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (813, 'Ellis', 3, 7, 6, 1, '12/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (312, 'Arthur', 3, 8, 3, 2, '2/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (286, 'Blakelee', 2, 11, 2, 2, '3/31/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (167, 'Diane-marie', 3, 7, 5, 1, '10/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (903, 'Langston', 3, 3, 6, 3, '11/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (952, 'Pennie', 2, 3, 4, 1, '5/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (861, 'Rasla', 1, 6, 1, 4, '3/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (840, 'Caralie', 3, 9, 6, 2, '11/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (372, 'Rachele', 3, 1, 2, 3, '2/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (734, 'Taite', 1, 7, 6, 2, '7/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (789, 'Niel', 2, 5, 5, 1, '10/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (582, 'Berni', 3, 2, 2, 2, '10/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (449, 'Finlay', 3, 2, 3, 2, '5/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (771, 'Tamarra', 2, 6, 3, 2, '1/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (650, 'Horst', 3, 10, 4, 4, '7/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (915, 'Kinnie', 3, 9, 5, 1, '7/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (878, 'Lucien', 3, 3, 1, 4, '11/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (989, 'Danila', 2, 4, 4, 1, '6/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (207, 'Beau', 1, 11, 3, 1, '4/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (627, 'Nico', 2, 10, 4, 3, '2/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (11, 'Julee', 1, 4, 4, 2, '5/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (652, 'Osbourn', 3, 10, 6, 1, '3/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (519, 'Jenda', 3, 3, 2, 4, '8/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (242, 'Donovan', 1, 2, 1, 1, '3/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (172, 'Nedda', 2, 5, 6, 4, '10/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (777, 'Raeann', 1, 8, 1, 2, '12/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (308, 'Gwynne', 3, 4, 4, 4, '1/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (643, 'Mickie', 3, 9, 2, 4, '7/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (94, 'Nickey', 1, 5, 3, 4, '4/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (404, 'Penelopa', 1, 9, 4, 3, '1/31/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (172, 'Briant', 1, 9, 3, 1, '1/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (188, 'Kit', 3, 2, 6, 4, '11/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (607, 'Adrianne', 3, 7, 2, 3, '6/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (896, 'Car', 1, 1, 1, 1, '2/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (322, 'Jeniece', 3, 10, 1, 3, '10/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (720, 'Wenona', 3, 4, 4, 2, '4/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (813, 'Dillie', 1, 9, 6, 4, '10/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (859, 'Christoffer', 3, 6, 5, 1, '4/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (677, 'Piper', 1, 2, 2, 3, '10/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (410, 'Abramo', 1, 4, 1, 1, '12/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (206, 'Jeffrey', 2, 3, 6, 3, '11/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (628, 'Anatollo', 3, 1, 3, 4, '9/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (925, 'Cynde', 2, 8, 1, 3, '3/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (866, 'Fiann', 1, 3, 2, 2, '4/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (92, 'Sunny', 2, 7, 6, 2, '6/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (402, 'Lidia', 1, 7, 3, 3, '9/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (90, 'Hy', 1, 5, 4, 2, '10/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (686, 'Gracie', 1, 1, 4, 4, '3/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (974, 'Norri', 1, 6, 2, 2, '10/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (911, 'Calley', 3, 2, 3, 4, '11/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (1, 'Tedra', 3, 7, 1, 4, '10/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (610, 'Rinaldo', 1, 4, 5, 3, '7/31/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (289, 'Saul', 2, 10, 1, 2, '10/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (278, 'Winifield', 3, 10, 6, 3, '11/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (181, 'Gayle', 2, 10, 3, 4, '10/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (142, 'Pancho', 2, 11, 5, 2, '6/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (659, 'Agnella', 2, 4, 3, 1, '6/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (826, 'Oswald', 3, 9, 6, 4, '7/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (722, 'Ted', 3, 5, 4, 4, '8/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (878, 'Tillie', 3, 7, 2, 2, '1/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (666, 'Osbert', 2, 2, 5, 1, '4/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (510, 'Wilton', 3, 5, 6, 2, '12/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (815, 'Rutger', 3, 10, 5, 3, '10/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (662, 'Nancee', 3, 1, 3, 4, '4/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (560, 'Dayna', 1, 11, 2, 3, '4/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (289, 'Brant', 2, 9, 5, 4, '8/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (585, 'Janek', 3, 7, 1, 1, '5/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (545, 'Rose', 1, 6, 6, 3, '4/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (997, 'Marchall', 3, 3, 2, 2, '5/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (528, 'Kayne', 3, 1, 4, 4, '7/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (124, 'Kiah', 3, 6, 4, 2, '11/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (872, 'Lindsey', 2, 6, 3, 1, '12/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (210, 'Tatiania', 1, 8, 2, 2, '12/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (503, 'Linnet', 3, 8, 1, 1, '9/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (832, 'Betsey', 3, 7, 1, 2, '2/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (215, 'Adrian', 2, 9, 6, 4, '3/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (341, 'Jaynell', 2, 3, 1, 3, '7/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (830, 'Renelle', 1, 7, 4, 2, '12/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (897, 'Danyette', 3, 4, 6, 3, '8/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (188, 'Siward', 3, 11, 6, 2, '11/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (42, 'Marian', 1, 2, 1, 4, '7/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (859, 'Lelia', 3, 9, 5, 2, '9/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (525, 'Louisa', 2, 11, 3, 1, '5/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (106, 'Benito', 1, 8, 5, 4, '6/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (559, 'Alfredo', 1, 2, 3, 4, '1/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (419, 'Levin', 3, 3, 2, 1, '8/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (875, 'David', 2, 1, 5, 4, '12/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (688, 'Cheri', 2, 6, 3, 4, '11/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (62, 'Granthem', 2, 4, 3, 3, '12/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (66, 'Stanford', 1, 4, 5, 1, '5/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (966, 'Vania', 3, 7, 5, 3, '6/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (640, 'Bonni', 2, 1, 1, 4, '10/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (783, 'Ty', 2, 7, 1, 4, '1/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (897, 'Pieter', 3, 8, 2, 1, '8/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (259, 'Karen', 1, 1, 1, 1, '9/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (615, 'Antoine', 3, 7, 2, 2, '5/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (191, 'Nelly', 3, 7, 3, 4, '11/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (399, 'Larissa', 1, 7, 4, 4, '8/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (693, 'Faun', 3, 7, 4, 4, '12/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (875, 'Tasia', 1, 5, 6, 3, '11/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (935, 'Abby', 1, 10, 2, 2, '3/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (331, 'Emmie', 1, 7, 6, 1, '11/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (733, 'Cassey', 3, 10, 5, 1, '1/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (451, 'Arlena', 3, 9, 4, 2, '7/31/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (107, 'Twila', 1, 1, 2, 2, '5/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (434, 'Leila', 3, 7, 6, 2, '12/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (28, 'Leonardo', 3, 5, 2, 2, '7/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (498, 'Hanna', 2, 8, 1, 3, '3/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (953, 'Herman', 2, 2, 1, 4, '5/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (775, 'Fabiano', 1, 7, 6, 1, '6/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (603, 'Debee', 3, 3, 6, 1, '1/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (565, 'Sascha', 3, 6, 2, 2, '3/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (831, 'Ximenez', 3, 1, 6, 2, '7/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (375, 'Waneta', 2, 1, 4, 2, '6/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (565, 'Sal', 1, 9, 2, 1, '12/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (51, 'Mycah', 2, 4, 3, 4, '4/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (691, 'Jayne', 3, 7, 2, 2, '5/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (191, 'Dotty', 3, 5, 2, 4, '8/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (140, 'Monro', 3, 8, 5, 1, '9/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (326, 'Maribel', 1, 1, 4, 2, '9/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (438, 'Papageno', 1, 4, 1, 3, '5/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (647, 'Quinton', 2, 11, 6, 1, '6/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (132, 'Nedda', 2, 5, 1, 3, '11/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (439, 'Coleman', 1, 6, 3, 3, '9/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (554, 'Stanleigh', 3, 3, 4, 4, '2/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (779, 'Stefania', 3, 1, 3, 1, '3/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (506, 'Corissa', 2, 11, 6, 4, '2/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (765, 'Enriqueta', 1, 1, 4, 1, '9/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (497, 'Jane', 1, 4, 1, 3, '12/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (806, 'Ethelin', 2, 7, 4, 4, '10/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (22, 'Jannelle', 3, 10, 1, 4, '9/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (928, 'Bea', 1, 9, 3, 3, '7/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (97, 'Cherice', 1, 9, 2, 2, '8/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (539, 'Krissy', 3, 5, 5, 2, '5/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (937, 'Dulcie', 3, 1, 5, 4, '11/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (290, 'Thatch', 3, 7, 6, 2, '3/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (389, 'Rodney', 3, 6, 3, 2, '2/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (175, 'Carter', 3, 1, 1, 4, '12/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (583, 'Currie', 2, 11, 6, 4, '4/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (566, 'Kev', 1, 1, 4, 4, '4/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (926, 'Lenora', 2, 8, 1, 2, '3/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (644, 'Engelbert', 3, 10, 2, 3, '2/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (237, 'Sena', 2, 2, 5, 2, '12/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (117, 'Stearn', 3, 1, 6, 2, '10/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (970, 'Garner', 3, 3, 1, 3, '10/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (266, 'Livia', 1, 11, 1, 4, '12/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (301, 'Karl', 2, 11, 1, 4, '7/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (450, 'Janka', 1, 10, 5, 3, '12/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (936, 'Ethelyn', 2, 6, 3, 2, '10/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (274, 'Scarlet', 1, 8, 4, 4, '12/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (940, 'Fleur', 3, 7, 6, 4, '1/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (737, 'Hedwig', 1, 3, 6, 4, '12/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (198, 'Garald', 3, 7, 1, 2, '6/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (458, 'Maire', 1, 8, 2, 4, '12/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (397, 'Jarid', 3, 9, 2, 4, '7/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (550, 'Ryan', 2, 9, 1, 1, '2/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (826, 'Spenser', 2, 10, 4, 1, '5/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (675, 'Rheba', 1, 6, 6, 4, '3/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (951, 'Melantha', 2, 3, 1, 4, '11/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (820, 'Remus', 1, 11, 1, 4, '3/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (142, 'Lenore', 2, 4, 4, 3, '4/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (977, 'Jermaine', 3, 3, 5, 1, '9/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (895, 'Ruby', 1, 2, 2, 2, '12/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (900, 'Glen', 3, 2, 4, 2, '10/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (646, 'Nonie', 1, 2, 4, 3, '1/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (711, 'Bette-ann', 3, 3, 2, 1, '7/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (804, 'Estel', 3, 3, 1, 4, '5/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (845, 'Virgil', 3, 4, 5, 1, '6/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (76, 'Ashil', 3, 5, 2, 2, '5/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (343, 'Karl', 1, 7, 1, 2, '3/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (446, 'Germaine', 2, 9, 5, 1, '12/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (717, 'Tirrell', 2, 4, 2, 3, '8/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (143, 'Clayton', 3, 6, 4, 4, '3/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (885, 'Piggy', 3, 10, 5, 2, '10/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (977, 'Kelsey', 2, 3, 1, 1, '8/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (36, 'Gabi', 2, 1, 1, 3, '1/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (961, 'Suzy', 1, 4, 6, 1, '6/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (948, 'Eustacia', 2, 8, 4, 4, '11/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (59, 'Hort', 1, 11, 6, 3, '5/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (451, 'Rory', 2, 4, 5, 2, '12/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (881, 'Llewellyn', 2, 6, 2, 4, '12/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (527, 'Franky', 3, 5, 3, 2, '2/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (102, 'Fair', 1, 4, 2, 2, '11/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (871, 'Byrom', 3, 6, 1, 4, '5/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (471, 'Lenna', 1, 5, 3, 4, '4/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (540, 'Ardenia', 1, 8, 1, 2, '10/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (797, 'Judi', 3, 8, 6, 1, '4/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (926, 'Bria', 2, 6, 3, 4, '10/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (290, 'Miguel', 2, 9, 5, 2, '1/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (87, 'Romola', 3, 2, 4, 4, '3/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (638, 'Cyndia', 3, 9, 5, 2, '9/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (52, 'Angelo', 1, 1, 4, 3, '7/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (250, 'Dalt', 2, 11, 4, 2, '9/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (935, 'Kristyn', 1, 4, 1, 3, '2/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (325, 'Maynord', 2, 1, 3, 2, '1/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (687, 'Isobel', 3, 2, 3, 4, '12/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (893, 'Ambrose', 1, 2, 1, 4, '4/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (212, 'Cherilyn', 2, 9, 6, 2, '3/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (889, 'Gerladina', 1, 3, 2, 1, '8/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (705, 'Stillman', 1, 4, 6, 4, '10/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (915, 'Annissa', 3, 9, 4, 3, '9/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (996, 'Benjy', 2, 5, 6, 4, '12/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (771, 'Abbie', 2, 5, 5, 3, '5/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (498, 'Ashlie', 3, 11, 4, 4, '5/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (391, 'Duane', 2, 6, 3, 1, '11/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (897, 'Joanie', 3, 3, 4, 3, '10/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (583, 'Madelene', 3, 11, 3, 2, '6/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (477, 'Nanny', 1, 1, 6, 4, '12/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (499, 'Mareah', 1, 4, 5, 1, '11/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (548, 'Otto', 2, 1, 2, 2, '4/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (930, 'Hartwell', 2, 8, 6, 2, '2/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (5, 'Barbi', 2, 6, 2, 2, '6/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (160, 'Magdalena', 1, 9, 3, 3, '11/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (489, 'Mariana', 2, 8, 5, 1, '1/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (920, 'Serge', 1, 4, 1, 1, '1/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (547, 'Emilia', 2, 11, 6, 2, '3/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (896, 'Stefa', 3, 2, 2, 1, '6/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (377, 'Haroun', 1, 11, 5, 2, '1/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (639, 'Rivi', 1, 9, 5, 2, '12/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (814, 'Charles', 1, 8, 2, 3, '3/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (733, 'Alisun', 1, 10, 4, 4, '4/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (476, 'Flo', 2, 7, 2, 2, '3/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (834, 'Hadlee', 2, 6, 6, 2, '2/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (902, 'Eddy', 2, 6, 5, 4, '2/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (250, 'Lissa', 2, 2, 2, 2, '1/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (16, 'See', 1, 9, 2, 4, '6/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (786, 'Rupert', 2, 8, 5, 3, '1/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (263, 'Marty', 2, 5, 4, 4, '11/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (237, 'Heywood', 1, 9, 5, 1, '1/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (521, 'Hewet', 3, 10, 4, 1, '8/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (659, 'Darn', 3, 10, 6, 4, '10/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (522, 'Hedvige', 2, 7, 2, 2, '4/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (440, 'Schuyler', 1, 7, 6, 1, '10/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (912, 'Brynne', 2, 3, 4, 4, '4/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (808, 'Johnette', 1, 9, 5, 3, '1/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (917, 'Rozanne', 3, 7, 2, 2, '4/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (22, 'Goldia', 3, 4, 2, 4, '5/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (333, 'Carmina', 1, 2, 1, 4, '8/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (84, 'Vale', 3, 11, 4, 2, '9/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (599, 'Gabby', 3, 1, 6, 3, '2/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (323, 'Ernesto', 1, 11, 2, 1, '1/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (110, 'Abram', 2, 5, 6, 2, '10/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (666, 'Benedetto', 2, 11, 4, 3, '11/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (630, 'Germana', 2, 9, 3, 3, '3/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (776, 'Ardeen', 1, 4, 3, 4, '3/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (708, 'Moina', 2, 10, 6, 4, '2/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (618, 'Ringo', 1, 2, 4, 2, '7/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (154, 'Erastus', 3, 10, 2, 1, '3/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (257, 'Karlen', 1, 5, 2, 4, '9/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (905, 'Brandy', 1, 7, 2, 2, '6/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (131, 'Ninon', 3, 8, 3, 2, '8/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (66, 'Catherin', 2, 2, 2, 1, '5/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (760, 'Odo', 3, 2, 2, 1, '12/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (35, 'Maurene', 2, 1, 6, 3, '1/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (632, 'Giffie', 3, 7, 2, 3, '3/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (894, 'Birgit', 2, 6, 5, 1, '12/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (772, 'Amargo', 2, 4, 5, 2, '9/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (322, 'Isidore', 1, 9, 4, 1, '8/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (164, 'Doria', 3, 8, 1, 1, '8/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (340, 'Ilaire', 3, 5, 3, 2, '11/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (739, 'Rozelle', 2, 10, 1, 1, '10/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (142, 'Anni', 1, 4, 2, 1, '9/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (227, 'Levin', 1, 3, 3, 2, '3/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (775, 'Anna-diane', 2, 4, 3, 2, '9/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (113, 'Dario', 3, 1, 6, 1, '5/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (365, 'Selle', 2, 11, 6, 4, '8/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (192, 'Hildegarde', 1, 9, 1, 2, '7/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (557, 'Bendick', 2, 5, 1, 4, '8/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (999, 'Shepperd', 1, 3, 2, 3, '4/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (781, 'Stanley', 2, 4, 6, 3, '2/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (164, 'Randene', 3, 8, 4, 3, '10/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (178, 'Rory', 1, 9, 3, 2, '8/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (831, 'Raquela', 2, 9, 1, 2, '6/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (383, 'Olympia', 2, 8, 1, 4, '6/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (786, 'Christalle', 1, 10, 1, 4, '8/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (478, 'Joaquin', 3, 9, 2, 4, '1/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (281, 'Mack', 3, 11, 5, 4, '11/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (330, 'Julio', 2, 4, 3, 3, '2/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (190, 'Talyah', 1, 11, 3, 1, '12/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (405, 'Darcy', 1, 2, 1, 4, '11/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (190, 'Janina', 1, 1, 6, 3, '10/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (741, 'Frederico', 2, 6, 1, 2, '3/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (420, 'Darrell', 3, 2, 1, 1, '11/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (462, 'Kali', 1, 10, 2, 3, '5/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (981, 'Diena', 2, 8, 2, 1, '12/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (593, 'Quinn', 3, 4, 3, 4, '10/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (616, 'Hedvige', 1, 11, 2, 1, '7/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (307, 'Florida', 3, 9, 4, 1, '5/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (510, 'Pauletta', 3, 1, 1, 1, '12/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (209, 'Patsy', 2, 6, 2, 4, '6/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (929, 'Mollie', 3, 4, 6, 4, '2/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (264, 'Packston', 1, 8, 2, 3, '12/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (672, 'Heath', 3, 2, 4, 3, '11/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (327, 'Stevie', 3, 5, 3, 1, '2/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (620, 'Esma', 3, 8, 6, 2, '7/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (662, 'Artemas', 2, 4, 1, 2, '6/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (614, 'Reeva', 2, 9, 3, 1, '12/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (352, 'Daffi', 2, 3, 4, 4, '3/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (804, 'Anette', 2, 6, 5, 4, '1/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (308, 'Fredia', 2, 9, 3, 1, '10/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (539, 'Cassy', 1, 11, 1, 4, '9/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (685, 'Paton', 1, 9, 6, 2, '12/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (557, 'Wilma', 2, 10, 6, 4, '10/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (120, 'Esme', 2, 11, 5, 3, '12/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (475, 'Cesare', 1, 8, 4, 3, '8/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (155, 'Dalila', 3, 11, 1, 2, '3/31/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (994, 'Karee', 1, 9, 5, 3, '8/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (729, 'Millard', 1, 6, 6, 1, '2/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (871, 'Livvy', 3, 7, 2, 2, '2/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (107, 'Mart', 2, 2, 3, 3, '10/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (207, 'Essie', 1, 4, 6, 3, '9/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (421, 'Tera', 3, 3, 6, 4, '7/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (861, 'Annette', 2, 1, 4, 4, '1/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (746, 'Harman', 3, 1, 3, 1, '5/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (870, 'Verne', 1, 1, 6, 2, '10/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (482, 'Adolphe', 2, 9, 4, 2, '3/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (879, 'Dominique', 2, 11, 4, 2, '11/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (19, 'Annabella', 2, 5, 1, 3, '8/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (969, 'Idell', 2, 9, 1, 4, '9/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (456, 'Lena', 3, 10, 4, 4, '2/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (696, 'Averil', 3, 11, 2, 2, '8/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (141, 'Hollyanne', 3, 7, 6, 3, '1/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (844, 'Willie', 1, 10, 1, 2, '8/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (386, 'Florrie', 2, 4, 2, 2, '12/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (928, 'Peterus', 2, 2, 2, 1, '5/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (841, 'Mallory', 1, 4, 4, 2, '3/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (890, 'Cassandre', 1, 11, 5, 4, '4/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (648, 'Beatriz', 2, 11, 5, 2, '8/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (180, 'Vinny', 2, 8, 3, 2, '10/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (164, 'Diena', 2, 2, 3, 2, '1/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (374, 'Katrina', 2, 5, 2, 1, '8/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (419, 'Prince', 3, 3, 2, 2, '6/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (950, 'Paloma', 3, 9, 2, 1, '7/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (807, 'Alyss', 2, 2, 2, 2, '12/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (170, 'Muffin', 1, 7, 1, 3, '11/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (93, 'Amandi', 1, 10, 5, 3, '3/31/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (190, 'Estel', 3, 2, 6, 3, '2/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (372, 'Sidonia', 2, 4, 6, 4, '1/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (834, 'Arabela', 1, 1, 1, 3, '2/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (897, 'Viole', 3, 9, 4, 3, '6/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (183, 'Kimberli', 3, 7, 4, 3, '2/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (799, 'Uri', 2, 1, 6, 1, '1/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (930, 'Danila', 2, 7, 4, 1, '8/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (377, 'Adena', 1, 11, 6, 1, '3/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (388, 'Marne', 2, 1, 3, 3, '5/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (532, 'Henrieta', 3, 9, 3, 1, '6/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (372, 'Akim', 1, 5, 3, 4, '9/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (236, 'Aline', 3, 8, 1, 4, '10/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (691, 'Kimberlyn', 2, 11, 2, 3, '2/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (592, 'Nikita', 3, 4, 3, 2, '8/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (453, 'Camellia', 1, 6, 6, 1, '8/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (458, 'Reuven', 2, 8, 5, 3, '6/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (525, 'Anneliese', 3, 1, 4, 4, '6/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (978, 'Natalya', 3, 7, 4, 3, '11/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (914, 'Wyn', 3, 9, 1, 4, '10/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (475, 'Nial', 1, 3, 1, 2, '8/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (431, 'Marjie', 1, 11, 4, 4, '8/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (299, 'Evangelina', 1, 8, 2, 3, '8/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (751, 'Georgine', 2, 5, 5, 1, '11/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (904, 'Judie', 3, 7, 5, 3, '5/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (277, 'Eduardo', 2, 10, 1, 1, '1/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (246, 'Shellysheldon', 1, 2, 2, 4, '8/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (879, 'Eudora', 1, 9, 5, 1, '7/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (278, 'Cissiee', 2, 9, 1, 2, '10/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (780, 'Gabrielle', 3, 4, 6, 4, '6/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (450, 'Alexandre', 2, 10, 3, 3, '8/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (169, 'Heinrick', 2, 1, 2, 3, '11/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (952, 'Wilow', 3, 2, 3, 1, '2/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (574, 'Zahara', 1, 8, 3, 3, '11/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (409, 'Brenna', 2, 4, 5, 2, '5/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (171, 'Sunny', 1, 8, 1, 4, '5/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (837, 'Dorey', 2, 7, 1, 2, '9/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (48, 'Ainsley', 2, 6, 4, 4, '7/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (784, 'Gui', 3, 4, 6, 4, '10/17/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (51, 'Nonnah', 3, 6, 1, 1, '6/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (991, 'Cybil', 3, 1, 5, 4, '2/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (303, 'Arabel', 1, 10, 4, 1, '7/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (399, 'Edita', 3, 1, 3, 2, '6/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (795, 'Cathyleen', 3, 6, 1, 4, '12/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (260, 'Prent', 2, 3, 4, 1, '11/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (347, 'Rorke', 1, 5, 6, 3, '12/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (243, 'Cirstoforo', 3, 7, 5, 3, '12/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (290, 'Rosanna', 1, 2, 6, 1, '7/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (880, 'Rosana', 2, 2, 6, 2, '7/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (676, 'Elmo', 3, 5, 4, 4, '3/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (271, 'Tait', 1, 2, 4, 4, '9/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (15, 'Sly', 3, 6, 3, 2, '7/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (2, 'Brande', 1, 2, 3, 2, '8/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (321, 'Joelynn', 2, 4, 6, 1, '4/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (775, 'Alaster', 2, 6, 3, 1, '7/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (172, 'Geneva', 3, 2, 5, 4, '12/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (550, 'Hilario', 3, 9, 4, 2, '5/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (560, 'Clark', 3, 2, 1, 2, '3/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (672, 'Yard', 2, 2, 6, 4, '11/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (114, 'Carlina', 3, 5, 6, 2, '7/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (33, 'Aurlie', 2, 9, 3, 3, '2/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (594, 'Dominique', 1, 2, 6, 2, '1/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (235, 'Launce', 3, 2, 4, 2, '8/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (785, 'Lindie', 3, 7, 6, 1, '3/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (40, 'Charles', 3, 10, 3, 4, '9/11/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (356, 'Leena', 3, 6, 6, 3, '1/31/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (199, 'Marya', 1, 6, 5, 2, '2/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (41, 'Wye', 3, 3, 2, 1, '7/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (78, 'Ambrosio', 1, 11, 2, 4, '5/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (925, 'Finlay', 3, 9, 4, 2, '1/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (421, 'Hilary', 2, 5, 6, 4, '10/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (730, 'Darell', 3, 6, 5, 1, '12/20/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (884, 'Augustin', 2, 3, 6, 1, '2/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (516, 'Jermain', 3, 8, 5, 1, '9/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (435, 'Tarra', 3, 4, 2, 4, '9/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (71, 'Kassia', 1, 6, 4, 1, '8/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (453, 'Brenna', 3, 3, 5, 1, '1/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (38, 'Alvis', 3, 7, 1, 1, '10/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (610, 'Ruthann', 1, 8, 4, 2, '6/30/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (303, 'Marci', 1, 4, 1, 1, '3/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (592, 'Cassandry', 2, 2, 6, 3, '1/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (487, 'Toby', 3, 3, 5, 4, '8/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (291, 'Mel', 2, 3, 1, 1, '8/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (586, 'Karly', 1, 3, 3, 1, '9/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (452, 'Paige', 3, 5, 4, 4, '4/8/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (6, 'Candide', 3, 2, 2, 2, '4/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (166, 'Danell', 1, 7, 1, 3, '11/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (685, 'Gianina', 2, 3, 3, 3, '3/7/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (460, 'Malinde', 2, 11, 4, 3, '5/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (927, 'Lazarus', 1, 11, 1, 2, '1/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (337, 'Christiano', 2, 6, 2, 3, '7/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (508, 'Adelaide', 3, 1, 2, 4, '3/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (78, 'Faye', 1, 6, 6, 1, '10/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (883, 'Davon', 1, 9, 3, 2, '4/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (373, 'Stephi', 1, 7, 4, 3, '5/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (516, 'Diannne', 1, 7, 6, 1, '6/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (767, 'Renell', 2, 7, 5, 2, '12/13/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (311, 'Alecia', 1, 1, 6, 3, '4/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (942, 'Remus', 3, 11, 2, 2, '11/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (802, 'Deana', 3, 2, 4, 1, '1/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (540, 'Viviene', 3, 8, 5, 1, '4/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (267, 'Earlie', 3, 5, 1, 3, '4/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (899, 'Saraann', 1, 2, 4, 3, '8/3/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (380, 'Lynn', 2, 7, 6, 3, '7/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (658, 'Filide', 2, 4, 1, 2, '11/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (595, 'Johann', 3, 8, 2, 3, '2/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (196, 'Devonne', 3, 1, 6, 4, '3/26/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (845, 'Lauren', 3, 1, 2, 2, '4/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (608, 'Allayne', 3, 7, 3, 2, '11/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (442, 'Pattie', 2, 3, 3, 3, '1/22/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (99, 'Pru', 2, 1, 5, 1, '6/18/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (365, 'Jannelle', 3, 5, 3, 2, '9/5/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (216, 'Maggy', 3, 2, 4, 4, '8/15/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (175, 'Nelia', 2, 2, 6, 3, '4/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (910, 'Lezlie', 2, 6, 1, 3, '9/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (559, 'Marsha', 3, 7, 2, 1, '6/12/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (83, 'Roddy', 3, 1, 6, 2, '10/9/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (67, 'Kent', 1, 7, 3, 1, '3/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (766, 'Stavro', 1, 1, 3, 3, '4/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (393, 'Rhys', 3, 4, 4, 4, '2/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (810, 'Thomasin', 1, 11, 2, 2, '12/2/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (471, 'Roda', 1, 1, 1, 3, '12/14/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (989, 'Pollyanna', 2, 9, 2, 3, '11/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (19, 'Gilemette', 2, 11, 1, 3, '10/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (936, 'Yehudi', 1, 1, 2, 1, '5/29/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (849, 'Fabe', 2, 10, 5, 3, '8/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (611, 'Suzy', 1, 7, 4, 4, '8/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (884, 'Cheri', 2, 3, 5, 3, '3/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (717, 'Buddie', 1, 11, 2, 4, '12/16/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (737, 'Andree', 1, 7, 1, 4, '8/19/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (888, 'Theodoric', 1, 9, 2, 3, '3/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (827, 'Carter', 2, 8, 3, 2, '1/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (840, 'Gwenette', 2, 9, 3, 4, '4/1/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (739, 'Malory', 3, 1, 1, 4, '6/25/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (741, 'Marleah', 1, 3, 5, 2, '4/28/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (759, 'Maure', 2, 7, 3, 1, '7/24/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (696, 'Loren', 1, 10, 3, 2, '12/6/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (147, 'Geordie', 1, 7, 1, 4, '2/21/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (894, 'Rubetta', 3, 3, 3, 4, '2/23/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (291, 'Blair', 1, 5, 4, 2, '8/4/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (478, 'Ambrosio', 2, 2, 5, 2, '6/10/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (257, 'Jecho', 1, 7, 3, 3, '9/27/2022');
            insert into carbono_footprints (quantity, note, id_fp_category, id_activity, id_fp_origin, id_u_measurement, created_at) values (763, 'Eleanor', 3, 9, 5, 2, '4/27/2022');

            `

        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

