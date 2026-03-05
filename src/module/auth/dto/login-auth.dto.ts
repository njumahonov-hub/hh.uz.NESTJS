import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"

export class LoginAuthDto { 
    @IsString()
    @IsEmail()
    @ApiProperty({default: "njumahonov@gmail.com"})
    email: string

    @IsString()
    @ApiProperty({default: "nodir6768"})
    password: string
}
