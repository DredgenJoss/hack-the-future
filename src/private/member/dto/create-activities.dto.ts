import {
    IsOptional,
    IsNotEmpty
} from 'class-validator';

export class CreateActivitiesDto {

    @IsNotEmpty({message: 'La actividad debe tener un nombre.'})
    activity_name: string;

    @IsOptional()
    activity_description: string;

    @IsNotEmpty({message: 'La actividad debe tener una categoría asignada.'})
    id_fp_category: number;

    @IsNotEmpty({message: 'La actividad debe tener un origen asignado.'})
    id_fp_origin: number;

}
