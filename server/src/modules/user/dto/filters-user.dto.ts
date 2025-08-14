import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max, IsIn } from 'class-validator';

export class FiltersUserDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt() @Min(1)
  page = 1;

  @ApiPropertyOptional({ example: 10 })
  @Type(() => Number)
  @IsInt() @Min(1) @Max(100)
  pageSize = 10;

  @ApiPropertyOptional({ example: 'created_at' })
  @IsOptional() @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ example: 'DESC', enum: ['ASC', 'DESC'] })
  @IsOptional() @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ example: 'john' })
  @IsOptional() @IsString()
  q?: string;

  @ApiPropertyOptional({ example: true })
  @Type(() => Boolean)
  @IsOptional()
  withDeleted?: boolean;
}
