import { PartialType } from '@nestjs/mapped-types';
import {
    IsNotEmpty
} from 'class-validator';
import { CreateMeasurementDto } from './create-measurement.dto';

export class UpdateMeasurementDto extends PartialType(CreateMeasurementDto) {
    @IsNotEmpty({message: 'Se necesita el ID para actualizar el registro.'})
    id_u_measurement: number
}
