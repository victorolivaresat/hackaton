import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ required: false })
  profileImage?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  darkMode: boolean;

  @ApiProperty({ required: false })
  expirationPassword?: Date;

  @ApiProperty()
  flagPassword: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  deletedAt?: Date;

  @ApiProperty({ required: false })
  role?: string;

  @ApiProperty({ required: false })
  roleId?: number;
}

export class PagedUserResponseDto {
  items: UserResponseDto[];
  total: number;
  page: number;
  pageSize: number;
}
