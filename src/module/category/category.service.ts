import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { cate_title } = createCategoryDto;

    const exists = await this.categoryRepo.findOne({ where: { cate_title } });
    if (exists) throw new BadRequestException("Bu kategoriya allaqachon mavjud");

    const newCategory = this.categoryRepo.create(createCategoryDto);
    const category = await this.categoryRepo.save(newCategory);

    return {
      message: "Category successfully created",
      category
    };
  }

  async findAll() {
    return await this.categoryRepo.find({ relations: { job: true } });
  }


async findOne(id: number) {
  const category = await this.categoryRepo.findOne({
    where: { id },
    relations: { 
      job: true 
    }
  });

  if (!category) {
    throw new NotFoundException(`ID si ${id} bo'lgan kategoriya topilmadi`);
  }

  return category;
}


async update(id: number, updateCategoryDto: UpdateCategoryDto) {
  const category = await this.categoryRepo.findOne({ where: { id } });
  if (!category) {
    throw new NotFoundException(`ID si ${id} bo'lgan kategoriya topilmadi`);
  }

  await this.categoryRepo.update(id, updateCategoryDto);

  return this.findOne(id);
}


async remove(id: number) {
  const category = await this.categoryRepo.findOne({ where: { id } });

  if (!category) {
    throw new NotFoundException(`ID si ${id} bo'lgan kategoriya topilmadi`);
  }

  await this.categoryRepo.remove(category);

  return {
    message: "Category successfully deleted",
    deletedId: id
  };
}
}
