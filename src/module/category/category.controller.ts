import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/shared/constant/user.role';

@ApiTags('Category')
@ApiInternalServerErrorResponse({description: "internal server error"})
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard) 
  @Roles(UserRole.ADMIN, UserRole.USER)           
  @Post()
  @ApiOperation({ summary: "Yangi kategoriya qo'shish (Faqat Admin)" })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard) 
  @Get()
  @ApiOperation({ summary: "Barcha kategoriyalarni olish (Public)" })
  async findAll() {
    return this.categoryService.findAll();
  }


@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard) 
@Get(':id')
@ApiOperation({ summary: "Bitta kategoriya va undagi barcha ishlarni ko'rish (Public)" })
@ApiParam({ name: 'id', description: 'Kategoriya ID si' })
async findOne(@Param('id') id: string) {
  return this.categoryService.findOne(+id);
}


@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard) 
@Roles(UserRole.ADMIN, UserRole.USER)           
@Patch(':id')
@ApiOperation({ summary: "Kategoriyani tahrirlash (Faqat Admin)" })
@ApiParam({ name: 'id', description: 'Kategoriya ID si' })
async update(
  @Param('id') id: string, 
  @Body() updateCategoryDto: UpdateCategoryDto
) {
  return this.categoryService.update(+id, updateCategoryDto);
}


@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard) 
@Roles(UserRole.ADMIN, UserRole.USER)            
@Delete(':id')
@ApiOperation({ summary: "Kategoriyani o'chirish (Faqat Admin)" })
@ApiParam({ name: 'id', description: 'Kategoriya ID si' })
async remove(@Param('id') id: string) {
  return this.categoryService.remove(+id);
}
}
