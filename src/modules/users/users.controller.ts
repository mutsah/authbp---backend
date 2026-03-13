import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //   Get current user profile
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProfile(@Req() req: RequestWithUser): Promise<UserResponseDto> {
    return this.usersService.findOne(req.user.id);
  }

  //   Get all users (admin only)
  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully.',
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  //   Get user by ID (admin only)
  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get user by ID (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') userId: string): Promise<UserResponseDto> {
    return this.usersService.findOne(userId);
  }

  //   update current user profile
  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Email already in use.' })
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(userId, updateUserDto);
  }

  //   change current user password
  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async changePassword(
    @GetUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return await this.usersService.changePassword(userId, changePasswordDto);
  }

  // delete user by id
  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete user by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deleteUser(@Param('id') userId: string): Promise<{ message: string }> {
    return await this.usersService.remove(userId);
  }
}
