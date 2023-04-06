import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Categories } from "./categories.entity";
import { Origins } from "./origins.entity";
import { Footprint } from "./footprint.entity";

@Entity('activities', {schema: 'public'})
export class Activities {

    @PrimaryGeneratedColumn({ name: 'id_activity' })
    id_activity: number;

    @Column({ name: 'activity_name' })
    activity_name: string;

    @Column({ name: 'activity_description' })
    activity_description: string;

    @Column({ name: 'id_fp_category'})
    id_fp_category: number;

    @Column({ name: 'id_fp_origin'})
    id_fp_origin: number;

    @Column({ name: 'created_at' })
    created_at: Date;

    @Column({ name: 'updated_at' })
    updated_at: Date;

    @ManyToOne(() => Categories, categories => categories.activities, { cascade: false, eager: true })
    @JoinColumn({ name: "id_fp_category" })
    categories: Categories;

    @ManyToOne(() => Origins, origins => origins.activities, { cascade: false, eager: true })
    @JoinColumn({ name: "id_fp_origin" })
    origins: Origins;

    @OneToMany(() => Footprint, footprint => footprint.id_c_footprints)
    footprint: Footprint[]; 

}
