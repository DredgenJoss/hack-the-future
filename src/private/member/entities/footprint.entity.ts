import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Measurement } from "./measurement.entity";
import { Activities } from "./activities.entity";
import { Origins } from "./origins.entity";
import { Categories } from "./categories.entity";

@Entity('carbono_footprints', {schema: 'public'})
export class Footprint {
    
    @PrimaryGeneratedColumn({ name: 'id_c_footprints' })
    id_c_footprints: number;

    @Column({ name: 'quantity' })
    quantity: number;

    @Column({ name: 'note' })
    note: string;

    @Column({ name: 'id_fp_category'})
    id_fp_category: number;

    @Column({ name: 'id_activity'})
    id_activity: number;

    @Column({ name: 'id_fp_origin'})
    id_fp_origin: number;

    @Column({ name: 'id_u_measurement'})
    id_u_measurement: number;

    @Column({ name: 'created_at' })
    created_at: Date;

    @Column({ name: 'updated_at' })
    updated_at: Date;

    @ManyToOne(() => Categories, categories => categories.id_fp_category, { cascade: false, eager: true })
    @JoinColumn({ name: "id_fp_category" })
    categories: Categories;

    @ManyToOne(() => Activities, activities => activities.id_activity, { cascade: false, eager: true })
    @JoinColumn({ name: "id_activity" })
    activities: Measurement;

    @ManyToOne(() => Origins, origins => origins.id_fp_origin, { cascade: false, eager: true })
    @JoinColumn({ name: "id_fp_origin" })
    origins: Origins;

    @ManyToOne(() => Measurement, Measurement => Measurement.id_u_measurement, { cascade: false, eager: true })
    @JoinColumn({ name: "id_u_measurement" })
    measurement: Measurement;

}
