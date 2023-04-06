import { PartialType } from '@nestjs/mapped-types';
import {
    IsNotEmpty
} from 'class-validator';
import { CreateCategoriesDto } from './create-categories.dto';

export class UpdateCategoriesDto extends PartialType(CreateCategoriesDto) {
    @IsNotEmpty({message: 'Se necesita el ID para actualizar el registro.'})
    id_fp_category: number
}
