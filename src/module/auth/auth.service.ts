import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, ForgotPassword, ResetPassword } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import * as nodemailer from "nodemailer"
import * as bcrypt from "bcrypt"
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ChangePasswordDto } from './dto/changeP-auth.dto';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter
  constructor(
    @InjectRepository(Auth) private authRepo: Repository<Auth>,
    private jwtService: JwtService
  ) {
      this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "njumahonov@gmail.com",
        pass: process.env.APP_KEY,
      },
    })
  }

    async register(createAuthDto: CreateAuthDto): Promise<{message: string}> {
    try {
      const { username, email, password } = createAuthDto as any;
      const foundeduser = await this.authRepo.findOne({
        where: { email },
      });

      if (foundeduser) throw new BadRequestException("email already exist");

      const hashpas = await bcrypt.hash(password, 10);

      const code = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 10),
      ).join("");

      await this.transporter.sendMail({
        from: "njumahonov@gmail.com",
        to: email,
        subject: "otp",
        text: "simple",
        html: `<b>${code}</b>`,
      });

      const time = Date.now() + 120000;

      const user = this.authRepo.create({
        username,
        email,
        password: hashpas,
        otp: code,
        otptime: time,
      });

      await this.authRepo.save(user);

      return {message: "Registered"}
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

    async verify(
    verifyAuthDto: VerifyAuthDto,
  ): Promise<{ access_token: string }> {
    try {
      const { email, otp } = verifyAuthDto;
      const foundeduser = await this.authRepo.findOne({
        where: { email },
      });

      if (!foundeduser) throw new BadRequestException("user not found");

      const otpValidation = /^\d{6}$/.test(otp);

      if (!otpValidation) throw new BadRequestException("wrong otp validation");

      const time = Date.now();

      if (time > foundeduser.otptime) throw new BadRequestException("otp time expired");

      if (otp !== foundeduser.otp) throw new BadRequestException("wrong otp");

      await this.authRepo.update(foundeduser.id, {otp: " ", otptime: 0})

      const payload = {id: foundeduser.id, email: foundeduser.email, roles: foundeduser.role };
      const access_token = await this.jwtService.signAsync(payload);

      return {
        access_token,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

     async login(loginAuthDto: LoginAuthDto): Promise<{message: string} | {token: string}> {
    const { email, password} = loginAuthDto as any
    const foundeduser = await this.authRepo.findOne({where: {email}})

    if(!foundeduser) throw new UnauthorizedException("email not found")

      const comp = await bcrypt.compare(password, foundeduser.password)


      if(comp) {
           const code = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 10),
      ).join("");

      await this.transporter.sendMail({
        from: "njumahonov@gmail.com",
        to: email,
        subject: "otp",
        text: "simple",
        html: `<b>${code}</b>`,
      });

      const time = Date.now() + 120000;

      await this.authRepo.update(foundeduser.id, {otp: code, otptime: time})

      return {message: "otp sent, Please check your email"}
      } else {
        return {message: "wrong password"}
      }

    }

  
  async forgotPassword(forgotPassword: ForgotPassword): Promise<{ message: string }> {
    try {
      const {email} = forgotPassword as any
      const user = await this.authRepo.findOne({ where: { email } });

      if (!user) throw new BadRequestException("User with this email not found");

      
      const code = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 10),
      ).join("");

    
      await this.transporter.sendMail({
        from: "njumahonov@gmail.com",
        to: email,
        subject: "Password Reset OTP",
        html: ` Sizning parolni tiklash kodingiz: <b>${code}</b>. Amal qilish muddati 2 daqiqa.`,
      });

      const expiryTime = Date.now() + 120000; 

      
      await this.authRepo.update(user.id, { 
        otp: code, 
        otptime: expiryTime 
      });

      return { message: "OTP sent to your email" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async resetPassword(resetPassword: ResetPassword): Promise<{ message: string }> {
    try {
      const { email, otp, password } = resetPassword as any; 

      const user = await this.authRepo.findOne({ where: { email } });
      if (!user) throw new BadRequestException("User not found");

      if (Date.now() > user.otptime) throw new BadRequestException("OTP time expired");
      if (otp !== user.otp) throw new BadRequestException("Invalid OTP");

      const hashedPass = await bcrypt.hash(password, 10);

      await this.authRepo.update(user.id, {
        password: hashedPass,
        otp: "",
        otptime: 0
      });

      return { message: "Password reset successfully" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }


async getProfile(id: number) {
  const user = await this.authRepo.findOne({
    where: { id },
    select: ['username', 'email', 'first_name', 'last_name', 'profil_img']
  })

    if(!user) throw new NotFoundException("User not found")

    return user
}


async updateProfile(userId: number, updateDto: UpdateAuthDto) {
  const user = await this.authRepo.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundException("User not found");

  if (updateDto.username) {
    const existing = await this.authRepo.findOne({ where: { username: updateDto.username } });
    if (existing && existing.id !== userId) {
      throw new BadRequestException("Username already taken");
    }
  }

  await this.authRepo.update(userId, updateDto);

  return this.getProfile(userId);
}



async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
  const { oldPassword, newPassword } = changePasswordDto;

  const user = await this.authRepo.findOne({ 
    where: { id: userId },
    select: ['id', 'password'] 
  });

  if (!user) throw new NotFoundException("user not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new BadRequestException("wrong old password");
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await this.authRepo.update(userId, { password: hashedNewPassword });

  return { message: "password succesful updated" };
}
  // create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
