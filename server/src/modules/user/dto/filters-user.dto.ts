import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max, IsIn } from 'class-validator';

export class FiltersUserDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 10;

  // Permitimos camelCase y snake_case, pero lo validamos con whitelist
  @ApiPropertyOptional({ example: 'created_at', enum: [
    'createdAt','created_at',
    'email',
    'username',
    'firstName','first_name',
    'lastName','last_name',
    'isActive','is_active',
  ] })
  @IsOptional()
  @IsIn([
    'createdAt','created_at',
    'email',
    'username',
    'firstName','first_name',
    'lastName','last_name',
    'isActive','is_active',
  ])
  sortBy?: string;

  @ApiPropertyOptional({ example: 'DESC', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ example: 'john' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  withDeleted?: boolean;
}
