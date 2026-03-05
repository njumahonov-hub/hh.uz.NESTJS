import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, ForgotPassword, ResetPassword } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { OwnerGuard } from './guard/owner.guard';
import { ChangePasswordDto } from './dto/changeP-auth.dto';


@ApiTags("Auth")
@ApiInternalServerErrorResponse({description: "internal server error"})
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


    @ApiOperation({description: "register user api (public)"})
    @ApiCreatedResponse({description: "registered"})
   @Post("register")
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

     @ApiOperation({description: "verify user api (public)"})
    @ApiNotFoundResponse({description: "user not found"})
    @Post("verify")
  verify(@Body() verifyAuthDto: VerifyAuthDto) {
    return this.authService.verify(verifyAuthDto);
  }

  
    @ApiOperation({description: "login user api (public)"})
    @ApiNotFoundResponse({description: "user not found"})
  @Post("login")
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
  
  @ApiOperation({description: "forgot_password user api (public)"})
  @ApiNotFoundResponse({description: "user not found"})
  @Post('forgot-password')
forgotPassword(@Body() forgotPassword: ForgotPassword) {
  return this.authService.forgotPassword(forgotPassword);
}


  @ApiOperation({description: "reset_password user api (public)"})
  @ApiNotFoundResponse({description: "user not found"})
@Post('reset-password')
resetPassword(@Body() resetPassword: ResetPassword) {
  return this.authService.resetPassword(resetPassword);
}


@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard,) 
@ApiOperation({description: "get my profil user api (owner)"})
@ApiNotFoundResponse({description: "user not found"})
@Get('my-profile')
getMe(@Req() req) {
  return this.authService.getProfile(req.user.id);
}


@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard) 
@Patch('profile/update')
@ApiOperation({ description: "update profil user api (owner)" })
async updateMyProfile(
  @Req() req, 
  @Body() updateAuthDto: UpdateAuthDto
) {
  const userId = req.user.id; 
  return this.authService.updateProfile(userId, updateAuthDto);
}

// auth.controller.ts

@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Patch('profile/change-password')
@ApiOperation({description: "change password user api (owner)"  })
async changePassword(
  @Req() req, 
  @Body() changePasswordDto: ChangePasswordDto
) {
  const userId = req.user.id; 
  return this.authService.changePassword(userId, changePasswordDto);
}
  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
