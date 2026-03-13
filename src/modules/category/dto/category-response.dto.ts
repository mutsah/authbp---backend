import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier of the category',
  })
  id: string;

  @ApiProperty({
    example: 'Electronics',
    description: 'The name of the category',
  })
  name: string;

  @ApiProperty({
    example: 'Decive and gadgets including phones, laptops, and accessories',
    description: 'A brief description of the category',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    example: 'electronics',
    description: 'A URL-friendly version of the category name',
    nullable: true,
  })
  slug: string | null;

  @ApiProperty({
    example: 'https://example.com/images/electronics.jpg',
    description: 'An optional URL for the category image',
    nullable: true,
  })
  imageurl: string | null;

  @ApiProperty({
    example: true,
    description: 'Indacates if the category is active',
  })
  isActive: boolean;

  @ApiProperty({
    example: 150,
    description: 'Number of products in this category',
  })
  productCount: number;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'The date and time when the product was created',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User updated date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
