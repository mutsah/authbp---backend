import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'currentPassword123',
  })
  @IsString()
  @IsNotEmpty({ message: 'Current password is required.' })
  currentPassword: string;

  @ApiProperty({
    description: 'New password',
    example: 'newPassword123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: 'New password is required.' })
  @MinLength(8, { message: 'New password must be at least 8 characters long.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
    message: 'New password must contain at least one letter and one number.',
  })
  newPassword: string;
}
