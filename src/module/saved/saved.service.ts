import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSavedDto } from './dto/update-saved.dto';
import { CreateSavedJobDto } from './dto/create-saved.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SavedJob } from './entities/saved.entity';
import { Repository } from 'typeorm';
import { Job } from '../jobs/entities/job.entity';

@Injectable()
export class SavedService {
  constructor(
    @InjectRepository(SavedJob)
    private readonly savedRepo: Repository<SavedJob>,
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
  ) {}

  async toggleSavedJob(userId: number, jobId: number) {
    const job = await this.jobRepo.findOne({ where: { id: jobId } });
    if (!job) throw new NotFoundException("Bunday ish topilmadi");

    const existing = await this.savedRepo.findOne({
      where: { 
        user: { id: userId }, 
        job: { id: jobId } 
      },
    });

    if (existing) {
      await this.savedRepo.remove(existing);
      return { 
        message: "Ish saqlanganlar ro'yxatidan o'chirildi", 
        status: 'removed' 
      };
    }

    const newSaved = this.savedRepo.create({
      user: { id: userId },
      job: { id: jobId },
    });

    await this.savedRepo.save(newSaved);
    return { 
      message: "Ish muvaffaqiyatli saqlandi", 
      status: 'saved' 
    };
  }

  async getMySavedJobs(userId: number) {
    return await this.savedRepo.find({
      where: { user: { id: userId } },
      relations: ['job', 'job.location', 'job.cate'], 
    });
  }
  // create(createSavedDto: CreateSavedJobDto) {
  //   return 'This action adds a new saved';
  // }

  // findAll() {
  //   return `This action returns all saved`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} saved`;
  // }

  // update(id: number, updateSavedDto: UpdateSavedDto) {
  //   return `This action updates a #${id} saved`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} saved`;
  // }
}
