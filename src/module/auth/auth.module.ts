import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
     JwtModule.register({
      global: true,
      secret: String(process.env.SECRET),
      signOptions: {expiresIn: "60d"}
    }),
  ], 
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, TypeOrmModule]
})
export class AuthModule {}
