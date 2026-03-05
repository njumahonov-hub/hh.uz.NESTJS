import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './module/auth/auth.module';
import { JobsModule } from './module/jobs/jobs.module';
import { CategoryModule } from './module/category/category.module';
import { Auth } from './module/auth/entities/auth.entity';
import { Job } from './module/jobs/entities/job.entity';
import { Category } from './module/category/entities/category.entity';
import { LocationsModule } from './module/locations/locations.module';
import { Location } from './module/locations/entities/location.entity';

@Module({
  imports: [ConfigModule.forRoot({envFilePath: ".env", isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: String(process.env.DB_PASSWORD),
      database: String(process.env.DB_NAME),
      entities: [Auth, Job, Category, Location],
      synchronize: true,
  }),
    AuthModule,
    JobsModule,
    CategoryModule,
    LocationsModule
  ]
    ,
  controllers: [],
  providers: [],
})
export class AppModule {}
