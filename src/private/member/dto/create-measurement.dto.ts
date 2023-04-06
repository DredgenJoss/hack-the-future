import {
    IsOptional,
    IsNotEmpty
} from 'class-validator';

export class CreateMeasurementDto {

    @IsNotEmpty({message: 'La entidad debe tener un nombre.'})
    measurement_name: string;

    @IsOptional()
    measurement_description: string;

}
