import { BaseEntity } from "src/database/base.entity";
import { Application } from "src/module/application/entities/application.entity";
import { Auth } from "src/module/auth/entities/auth.entity";
import { Category } from "src/module/category/entities/category.entity";
import { Location } from "src/module/locations/entities/location.entity";
import { SavedJob } from "src/module/saved/entities/saved.entity";
import { WorkExperience } from "src/shared/constant/work.experience";
import { WorkDay } from "src/shared/constant/workday";
import { WorkFormat } from "src/shared/constant/workformat";
import { WorkTime } from "src/shared/constant/worktime";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity({name: "Jobs"})
export class Job extends BaseEntity {
  @Column()
  job_title: string

  @Column()
  company_name: string

  @Column()
  job_price: string

  @Column()
  job_description: string

  @Column({default: WorkDay.FIVE_TWO})
  work_day: WorkDay

  @Column({default: WorkTime.EIGHT_HOUR_A_DAY})
  work_time: WorkTime

  @Column({default: WorkFormat.GIBRID})
  work_format: WorkFormat

  @Column({default: WorkExperience.NO_EXPERIENCE})
  work_experience: WorkExperience

  @Column({ type: 'jsonb', nullable: true, default: {} })
  extra_details: Record<string, any>;

  //   RELATION
  @ManyToOne(() =>Auth, (auth) => auth.job )
  @JoinColumn({name: "auth_id"})
  auth: Auth

  @ManyToOne(() => Category, (cate) => cate.job)
  @JoinColumn({name: "cate_id"})
  cate: Category

  @ManyToOne(() =>Location, (location) => location.job )
  @JoinColumn({name: "location_id"})
  location: Location

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[]; 

  @OneToMany(() => SavedJob, (savedJob) => savedJob.job)
  savedJobs: SavedJob[];
}
