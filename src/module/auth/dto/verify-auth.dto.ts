import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"

export class VerifyAuthDto { 
    @IsString()
    @IsEmail()
    @ApiProperty({default: "njumahonov@gmail.com"})
    email: string

    @IsString()
    @ApiProperty({default: ""})
    otp: string
}
