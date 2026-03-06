import { Application } from 'src/module/application/entities/application.entity';
import { Location } from '../../locations/entities/location.entity';
import { BaseEntity } from "src/database/base.entity";
import { Category } from "src/module/category/entities/category.entity";
import { Job } from "src/module/jobs/entities/job.entity";
import { UserRole } from "src/shared/constant/user.role";
import { Column, Entity, OneToMany } from "typeorm";
import { SavedJob } from 'src/module/saved/entities/saved.entity';

@Entity({name: "Auth"})
export class Auth extends BaseEntity {

    @Column()
    username: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    otp: string

    @Column({type: "bigint"})
    otptime: number

    @Column({default: UserRole.USER })
    role: UserRole

    @Column({nullable:true})
    first_name?: string

    @Column({nullable: true})
    last_name?: string

    @Column({nullable:true})
    profil_img?: string

    @Column({nullable: true})
    phone_number?: string

    // RELATION
    @OneToMany(() => Job, (job) => job.auth)
     job: Job[] 
    
    @OneToMany(() => Category, (cate) => cate.auth)
     cate: Category[] 
     
    @OneToMany(() => Location, (location) => location.auth)
     location: Location[] 

     @OneToMany(() => Application, (application) => application.applicant)
  applications: Application[]; 

  @OneToMany(() => SavedJob, (savedJob) => savedJob.user)
  savedJobs: SavedJob[];

}
