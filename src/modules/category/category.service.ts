import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dt';
import { CategoryResponseDto } from './dto/category-response.dto';
import { Category, Prisma } from '@prisma/client';
import { QueryCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  //   create a new category
  async create(
    createCategorydto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const { name, slug, ...rest } = createCategorydto;

    const categorySlug =
      slug ??
      name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');

    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (existingCategory) {
      throw new ConflictException(
        'A category with this slug already exists: ' +
          categorySlug +
          '. Please choose a different name or slug.',
      );
    }

    const category = await this.prisma.category.create({
      data: { name, slug: categorySlug, ...rest },
    });

    return this.formatCategory(category, 0);
  }

  //   get all categories with optional filters and pagination
  async findAll(queryDto: QueryCategoryDto): Promise<{
    data: CategoryResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const { isActive, search, page = 1, limit = 10 } = queryDto;

    const where: Prisma.CategoryWhereInput = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await this.prisma.category.count({ where });

    const categories = await this.prisma.category.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return {
      data: categories.map((category) =>
        this.formatCategory(category, category._count.products),
      ),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // get category by ID
  async findOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.formatCategory(category, Number(category._count.products));
  }

  // get category by slug
  async findBySlug(slug: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.formatCategory(category, Number(category._count.products));
  }

  private formatCategory(
    category: Category,
    productCount: number,
  ): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      slug: category.slug,
      imageurl: category.imageUrl,
      isActive: category.isActive,
      productCount,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
