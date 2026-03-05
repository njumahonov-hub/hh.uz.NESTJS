import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNumber, IsString } from "class-validator"

export class CreateAuthDto {
    @IsString({message: "string"})
    @ApiProperty({default: "nodirbek"})
    username: string

    @IsString()
    @IsEmail()
    @ApiProperty({default: "njumahonov@gmail.com"})
    email: string

    @IsString()
    @ApiProperty({default: "nodir6768"})
    password: string
}

export class ForgotPassword {
    @IsString()
    @IsEmail()
    @ApiProperty({default: "njumahonov@gmail.com"})
    email: string
}

export class ResetPassword {

    
    @IsString()
    @IsEmail()
    @ApiProperty({default: "njumahonov@gmail.com"})
    email: string
    
    @IsString()
    @ApiProperty({default: ""})
    otp: string

    @IsString()
    @ApiProperty({default: "nodir6768"})
    password: string
}

