import { PartialType } from '@nestjs/mapped-types';
import {
    IsNotEmpty
} from 'class-validator';
import { CreateOriginsDto } from './create-origins.dto';

export class UpdateOriginsDto extends PartialType(CreateOriginsDto) {
    @IsNotEmpty({message: 'Se necesita el ID para actualizar el registro.'})
    id_fp_origin: number
}
