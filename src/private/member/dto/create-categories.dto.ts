import {
    IsOptional,
    IsNotEmpty
} from 'class-validator';

export class CreateCategoriesDto {

    @IsNotEmpty({message: 'La categoría debe tener un nombre.'})
    category_name: string;

    @IsOptional()
    category_description: string;

}
