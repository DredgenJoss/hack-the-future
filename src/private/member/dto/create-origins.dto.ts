import {
    IsNotEmpty, 
    IsOptional
} from 'class-validator';

export class CreateOriginsDto {

    @IsNotEmpty({message: 'El origen debe tener un nombre.'})
    origin_name: string;

    @IsOptional()
    origin_description: string;

    @IsNotEmpty({message: 'El origen debe tener una unidad de medida asignada.'})
    id_u_measurement: number;
}
