import {
    IsOptional,
    IsNotEmpty
} from 'class-validator';

export class CreateFootprintDto {
    
    @IsNotEmpty({message: 'Para registrar una huella de carbono se necesita la cantidad.'})
    quantity: number;

    @IsOptional()
    note: string;

    @IsNotEmpty({message: 'Para registrar una huella de carbono se necesita la categoría.'})
    id_fp_category: number;

    @IsNotEmpty({message: 'Para registrar una huella de carbono se necesita la actividad.'})
    id_activity: number;

    @IsNotEmpty({message: 'Para registrar una huella de carbono se necesita la origen.'})
    id_fp_origin: number;

}
