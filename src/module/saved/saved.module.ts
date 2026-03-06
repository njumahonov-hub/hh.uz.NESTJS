import { Module } from '@nestjs/common';
import { SavedService } from './saved.service';
import { SavedController } from './saved.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedJob } from './entities/saved.entity';
import { JobsModule } from '../jobs/jobs.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SavedJob]),
    AuthModule,
    JobsModule
],
  controllers: [SavedController],
  providers: [SavedService],
})
export class SavedModule {}
