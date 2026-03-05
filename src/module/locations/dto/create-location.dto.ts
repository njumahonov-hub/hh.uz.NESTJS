import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class CreateLocationDto {
    @IsString()
    @ApiProperty({default: "Tashkent"})
    country_name: string

}
