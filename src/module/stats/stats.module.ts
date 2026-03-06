
import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../jobs/entities/job.entity';
import { Auth } from '../auth/entities/auth.entity';
import { Category } from '../category/entities/category.entity';
import { AuthModule } from '../auth/auth.module';
import { Application } from '../application/entities/application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Auth, Category, Application]),
    AuthModule,
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}