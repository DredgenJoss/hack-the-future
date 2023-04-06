import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Origins } from "./origins.entity";
import { Footprint } from "./footprint.entity";

@Entity('units_measurements', {schema: 'public'})
export class Measurement {

    @PrimaryGeneratedColumn({ name: 'id_u_measurement' })
    id_u_measurement: number;

    @Column({ name: 'measurement_name' })
    measurement_name: string;

    @Column({ name: 'measurement_description' })
    measurement_description: string;

    @Column({ name: 'created_at'})
    created_at: Date;

    @Column({ name: 'updated_at' })
    updated_at: Date;

    @OneToMany(() => Origins, origins => origins.id_u_measurement)
    origins: Origins[];    

    @OneToMany(() => Footprint, footprint => footprint.id_c_footprints)
    footprint: Footprint[]; 
}
