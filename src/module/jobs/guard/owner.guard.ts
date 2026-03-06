// owner.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../entities/job.entity';


@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id; 
    const jobId = request.params.id; 

    if (!jobId) return false;

    const job = await this.jobRepo.findOne({
      where: { id: jobId },
      relations: ['auth'],
    });

    if (!job) {
      throw new NotFoundException("Bunday e'lon topilmadi");
    }

    if (job.auth.id !== userId) {
      throw new ForbiddenException("Bu amalni bajarishga ruxsatingiz yo'q");
    }

    return true;
  }
}