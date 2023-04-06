import { PartialType } from '@nestjs/mapped-types';
import {
    IsNotEmpty
} from 'class-validator';
import { CreateFootprintDto } from './create-footprint.dto';

export class UpdateFootprintDto extends PartialType(CreateFootprintDto) {
    @IsNotEmpty({message: 'Se necesita el ID para actualizar el registro.'})
    id_c_footprints: number
}
