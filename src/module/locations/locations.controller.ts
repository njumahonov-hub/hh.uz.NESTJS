import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiBearerAuth, ApiConsumes, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/shared/constant/user.role';

@Controller('locations')
@ApiInternalServerErrorResponse({description: "internal server error"})
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard) 
  @Roles(UserRole.ADMIN, UserRole.USER )
  @ApiOperation({description: "Create locatoin api (admin)"})
@Post("createLocation")
create(@Body() createLocationDto: CreateLocationDto) {
  return this.locationsService.createLocation(createLocationDto);
}
  
  @ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard )
  @ApiOperation({description: "get all location api (public)"})
  @ApiOkResponse({description: "list of loaction"})
  @Get()
  findAll() {
    return this.locationsService.findAll();
  }


  @ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard )
@Get(':id')
@ApiOperation({ summary: "Joylashuv va unga tegishli barcha ishlarni olish" })
@ApiParam({ name: 'id', description: 'Location ID si' })
async findOne(@Param('id') id: string) {
  return this.locationsService.findOne(+id);
}


@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard) 
@Roles(UserRole.ADMIN, UserRole.USER)          
@Patch(':id')
@ApiOperation({ summary: "Joylashuvni tahrirlash (Faqat Admin)" })
async update(
  @Param('id') id: string, 
  @Body() updateLocationDto: UpdateLocationDto
) {
  return this.locationsService.update(+id, updateLocationDto);
}


@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard) 
@Roles(UserRole.ADMIN, UserRole.USER)           
@Delete(':id')
@ApiOperation({ summary: "Joylashuvni o'chirish (Faqat Admin)" })
@ApiParam({ name: 'id', description: "O'chirilishi kerak bo'lgan Location ID si" })
async remove(@Param('id') id: string) {
  return this.locationsService.remove(+id);
}
}
