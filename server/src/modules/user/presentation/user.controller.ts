import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '@common/decorators/permissions.decorator';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { UserCreateDto } from '../dto/user-create.dto';
import { FiltersUserDto } from '../dto/filters-user.dto';
import { UserService } from '../application/user.service';

@ApiTags('User')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @Permissions('system-administration.users.view')
  @ApiOperation({ summary: 'Listar usuarios (paginado y filtrado)' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  findAll(@Query() q: FiltersUserDto) {
    if (q && (q.page || q.pageSize || q.q || q.sortBy || q.sortOrder || q.withDeleted)) {
      return this.service.findAllPaged(q);
    }
    return this.service.findAll();
  }

  @Get(':id')
  @Permissions('system-administration.users.view')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  @Permissions('system-administration.users.create')
  @ApiOperation({ summary: 'Crear un usuario' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  create(@Body() data: UserCreateDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @Permissions('system-administration.users.update')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  update(@Param('id') id: string, @Body() data: UserUpdateDto) {
    return this.service.update(Number(id), data);
  }

  @Delete(':id')
  @Permissions('system-administration.users.delete')
  @ApiOperation({ summary: 'Eliminar un usuario (soft delete)' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }

  @Patch('restore/:id')
  @Permissions('system-administration.users.update')
  @ApiOperation({ summary: 'Restaurar un usuario eliminado' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  restore(@Param('id') id: string) {
    return this.service.restore(Number(id));
  }
}
