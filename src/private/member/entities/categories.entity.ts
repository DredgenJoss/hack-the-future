import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Activities } from "./activities.entity";
import { Footprint } from "./footprint.entity";

@Entity('footprint_categories', {schema: 'public'})
export class Categories {

    @PrimaryGeneratedColumn({ name: 'id_fp_category' })
    id_fp_category: number;

    @Column({ name: 'category_name' })
    category_name: string;

    @Column({ name: 'category_description' })
    category_description: string;

    @Column({ name: 'created_at'})
    created_at: Date;

    @Column({ name: 'updated_at' })
    updated_at: Date;

    @OneToMany(() => Activities, activities => activities.id_activity)
    activities: Activities[]; 

    @OneToMany(() => Footprint, footprint => footprint.id_c_footprints)
    footprint: Footprint[]; 
}
