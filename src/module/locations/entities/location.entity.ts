import { BaseEntity } from "src/database/base.entity";
import { Auth } from "src/module/auth/entities/auth.entity";
import { Job } from "src/module/jobs/entities/job.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity({name: "Locations"})
export class Location extends BaseEntity {
   @Column()
   country_name: string

   @OneToMany(() => Job, (job) => job.location)
   job: Job[] 

   @ManyToOne(() => Auth, (auth) => auth.location)
   @JoinColumn({name: "auth_id"})
   auth: Auth
}
