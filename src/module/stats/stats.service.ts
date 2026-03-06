// src/stats/stats.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../jobs/entities/job.entity';
import { Auth } from '../auth/entities/auth.entity';
import { Category } from '../category/entities/category.entity';
import { Application } from '../application/entities/application.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Job) private jobRepo: Repository<Job>,
    @InjectRepository(Auth) private userRepo: Repository<Auth>,
    @InjectRepository(Category) private cateRepo: Repository<Category>,
    @InjectRepository(Application) private appRepo: Repository<Application>,
  ) {}

  async getGlobalStats() {
    const [jobsCount, usersCount, cateCount] = await Promise.all([
      this.jobRepo.count(),
      this.userRepo.count(),
      this.cateRepo.count(),
    ]);

    const jobsByCategory = await this.jobRepo
      .createQueryBuilder('job')
      .select('category.cate_title', 'category')
      .addSelect('COUNT(job.id)', 'count')
      .leftJoin('job.cate', 'category')
      .groupBy('category.cate_title')
      .getRawMany();

    return {
      total_summary: {
        jobs: jobsCount,
        users: usersCount,
        categories: cateCount,
      },
      jobs_by_category: jobsByCategory,
    };
  }

  async getEmployerDashboard(employerId: number) {
    const myJobsCount = await this.jobRepo.count({ where: { auth: { id: employerId } } });
    
    const totalReceivedApps = await this.appRepo.count({
      where: { job: { auth: { id: employerId } } }
    });

    return {
      my_active_jobs: myJobsCount,
      total_applications_received: totalReceivedApps,
    };
  }
}