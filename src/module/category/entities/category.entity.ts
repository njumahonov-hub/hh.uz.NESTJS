import { BaseEntity } from "src/database/base.entity";
import { Auth } from "src/module/auth/entities/auth.entity";
import { Job } from "src/module/jobs/entities/job.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity({name: "Category"})
export class Category extends BaseEntity {
    @Column()
    cate_title: string

    // RELATION
    @ManyToOne(() =>Auth, (auth) => auth.cate )
      @JoinColumn({name: "auth_id"})
      auth: Auth

    @OneToMany(() => Job, (job) => job.cate)
    job: Job[]
}
