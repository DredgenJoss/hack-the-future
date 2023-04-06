import { PartialType } from '@nestjs/mapped-types';
import {
    IsNotEmpty
} from 'class-validator';
import { CreateActivitiesDto } from './create-activities.dto';

export class UpdateActivitiesDto extends PartialType(CreateActivitiesDto) {
    @IsNotEmpty({message: 'Se necesita el ID para actualizar el registro.'})
    id_activity: number
}
