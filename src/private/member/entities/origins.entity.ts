import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Measurement } from "./measurement.entity";
import { Activities } from "./activities.entity";
import { Footprint } from "./footprint.entity";

@Entity('footprint_origins', {schema: 'public'})
export class Origins {

    @PrimaryGeneratedColumn({ name: 'id_fp_origin' })
    id_fp_origin: number;

    @Column({ name: 'origin_name' })
    origin_name: string;

    @Column({ name: 'origin_description' })
    origin_description: string;

    @Column({ name: 'id_u_measurement'})
    id_u_measurement: number;

    @Column({ name: 'created_at' })
    created_at: Date;

    @Column({ name: 'updated_at' })
    updated_at: Date;

    @ManyToOne(() => Measurement, Measurement => Measurement.id_u_measurement, { cascade: false, eager: true })
    @JoinColumn({ name: "id_u_measurement" })
    measurement: Measurement;

    @OneToMany(() => Activities, activities => activities.id_activity)
    activities: Activities[];    

    @OneToMany(() => Footprint, footprint => footprint.id_c_footprints)
    footprint: Footprint[];    
}
