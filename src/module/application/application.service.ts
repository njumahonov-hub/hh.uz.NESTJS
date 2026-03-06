import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Repository } from 'typeorm';
import { Job } from '../jobs/entities/job.entity';

@Injectable()
export class ApplicationService {constructor(
    @InjectRepository(Application) private readonly appRepo: Repository<Application>,
    @InjectRepository(Job) private readonly jobRepo: Repository<Job>,
  ) {}

  async create(userId: number, dto: CreateApplicationDto) {
    const job = await this.jobRepo.findOne({ 
        where: { id: dto.job_id },
        relations: ['auth'] 
    });
    if (!job) throw new NotFoundException("Bunday ish topilmadi");

    if (job.auth.id === userId) {
      throw new BadRequestException("O'zingiz joylagan ishga murojaat qila olmaysiz");
    }

    const alreadyApplied = await this.appRepo.findOne({
      where: { job: { id: dto.job_id }, applicant: { id: userId } }
    });
    if (alreadyApplied) {
      throw new BadRequestException("Siz ushbu ishga allaqachon murojaat qilgansiz");
    }

    const newApp = this.appRepo.create({
      job: { id: dto.job_id },
      applicant: { id: userId },
      message: dto.message
    });

    return await this.appRepo.save(newApp);
  }



async getEmployerApplications(employerId: number) {
  try {
    const applications = await this.appRepo.createQueryBuilder('application')
      .leftJoinAndSelect('application.job', 'job')
      
      .leftJoin('job.auth', 'employer')
      
      .leftJoin('application.applicant', 'applicant')
      
      .addSelect([
        'applicant.id',
        'applicant.first_name', 
        'applicant.last_name', 
        'applicant.phone_number'
      ])
    
      .where('employer.id = :employerId', { employerId })
      
      .orderBy('application.created_at', 'DESC')
      .getMany();

    return applications;
  } catch (error) {
    console.error("Query hatosi:", error); 
    throw new InternalServerErrorException("Murojaatlarni olishda xatolik yuz berdi");
  }
}


async getMyApplications(userId: number) {
  return await this.appRepo.createQueryBuilder('application')
    .leftJoinAndSelect('application.job', 'job')
    
    .leftJoin('job.auth', 'employer')
    
    .addSelect([
      'employer.id',
      'employer.first_name',
      'employer.last_name',
      'employer.phone_number'
    ])
    
    .where('application.applicant = :userId', { userId })
    
    .orderBy('application.created_at', 'DESC')
    .getMany();
}


async updateStatus(id: number, employerId: number, status: string) {
  const application = await this.appRepo.findOne({
    where: { 
      id, 
      job: { auth: { id: employerId } } 
    },
  });

  if (!application) {
    throw new NotFoundException("Ariza topilmadi yoki sizda bu amalga ruxsat yo'q");
  }

  application.status = status;
  
  return await this.appRepo.save(application);
}

  // findAll() {
  //   return `This action returns all application`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} application`;
  // }

  // update(id: number, updateApplicationDto: UpdateApplicationDto) {
  //   return `This action updates a #${id} application`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} application`;
  // }
}
