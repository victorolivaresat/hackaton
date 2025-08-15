import { ApiProperty } from '@nestjs/swagger';

export class ModuleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}


export class PermissionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  moduleId: number;

  @ApiProperty({ type: ModuleDto })
  module: ModuleDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PagedPermissionResponseDto {
  items: PermissionResponseDto[];
  total: number;
  page: number;
  pageSize: number;
}
