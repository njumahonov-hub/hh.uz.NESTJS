

import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Job } from '../../jobs/entities/job.entity';
import { Auth } from '../../auth/entities/auth.entity';
import { BaseEntity } from 'src/database/base.entity';

@Entity('Applications')
export class Application extends BaseEntity {

  @ManyToOne(() => Job, (job) => job.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => Auth, (auth) => auth.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'applicant_id' })
  applicant: Auth;

  @Column({ type: 'text', nullable: true })
  message: string; 

  @Column({
    type: 'enum',
    enum: ['pending', 'viewed', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: string;

}