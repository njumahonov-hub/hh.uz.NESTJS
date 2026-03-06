import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Brackets, Repository } from 'typeorm';
import { GetJobsFilterDto } from './dto/GetJobsFilterDto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
  ) {}

  async createJob(userId: number, createJobDto: CreateJobDto) {
    const { cate_id, location_id, ...jobData } = createJobDto;

    const newJob = this.jobRepo.create({
      ...jobData,
      auth: { id: userId },        
      cate: { id: cate_id },        
      location: { id: location_id } 
    });

    const savedJob = await this.jobRepo.save(newJob);
    
    return {
      message: "Ish e'loni muvaffaqiyatli joylandi",
      jobId: savedJob.id
    };
  }


async findAll(filterDto: GetJobsFilterDto) {
  const { search, cate_id, location_id, page, limit } = filterDto;
  
  const take = limit || 10;
  const skip = ((page || 1) - 1) * take;

  const query = this.jobRepo.createQueryBuilder('job')
    .leftJoinAndSelect('job.cate', 'category')
    .leftJoinAndSelect('job.location', 'location')
    .leftJoinAndSelect('job.auth', 'employer'); 

 if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('job.job_title ILIKE :search', { search: `%${search}%` })
            .orWhere('job.company_name ILIKE :search', { search: `%${search}%` })
            .orWhere('category.cate_title ILIKE :search', { search: `%${search}%` })
            .orWhere('location.country_name ILIKE :search', { search: `%${search}%` });
            qb.orWhere('CAST(job.work_experience AS TEXT) ILIKE :search', { search: `%${search}%` });
            qb.orWhere('CAST(job.job_price AS TEXT) ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

  if (cate_id) {
    query.andWhere('category.id = :cate_id', { cate_id });
  }

  if (location_id) {
    query.andWhere('location.id = :location_id', { location_id });
  }

  query.orderBy('job.created_at', 'DESC'); 

  query.skip(skip).take(take);

  const [items, total] = await query.getManyAndCount();

  return {
    data: items,
    meta: {
      totalItems: total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / take),
      limit: Number(take)
    }
  };
}

async findOne(id: number) {
  const job = await this.jobRepo.createQueryBuilder('job')
    .leftJoinAndSelect('job.cate', 'category')
    .leftJoinAndSelect('job.location', 'location')
    .leftJoin('job.auth', 'author') 
    .addSelect([
      'author.phone_number', 
      'author.first_name', 
      'author.last_name'
    ])
    .where('job.id = :id', { id })
    .getOne();

  if (!job) {
    throw new NotFoundException(`${id}-raqamli ish e'loni topilmadi`);
  }

  return job;
}

async update(id: number, updateJobDto: UpdateJobDto) {
  const job = await this.jobRepo.preload({
    id: +id,
    ...updateJobDto,
  });

  if (!job) throw new NotFoundException("Ish topilmadi");

  if (updateJobDto.cate_id) job.cate = { id: updateJobDto.cate_id } as any;
  if (updateJobDto.location_id) job.location = { id: updateJobDto.location_id } as any;

  return await this.jobRepo.save(job);
}

async remove(id: number) {
  const result = await this.jobRepo.delete(id);
  
  if (result.affected === 0) {
    throw new NotFoundException(`${id}-raqamli ish topilmadi`);
  }

  return { message: "Ish e'loni muvaffaqiyatli o'chirildi" };
}
}
