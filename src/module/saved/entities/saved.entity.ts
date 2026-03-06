// src/saved-jobs/entities/saved-job.entity.ts

import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';
import { Job } from '../../jobs/entities/job.entity';
import { BaseEntity } from 'src/database/base.entity';

@Entity('SavedJobs')
export class SavedJob extends BaseEntity {

  @ManyToOne(() => Auth, (auth) => auth.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Auth;

  @ManyToOne(() => Job, (job) => job.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: Job;

}
