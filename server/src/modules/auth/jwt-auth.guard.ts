import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../user/domain/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Request } from 'express';


interface JwtPayload {
  sub: string;
  email?: string;
  [key: string]: any;
}

interface AuthenticatedUser {
  sub: string;
  email?: string;
  roles: {
    permissions: { name: string }[];
  }[];
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: AuthenticatedUser }>();
    const token = this.extractToken(req);
    const payload = await this.verifyToken(token);

    // Cargar usuario con las relaciones CORRECTAS según las entidades
    const user = await this.userRepo.findOne({
      where: { id: parseInt(payload.sub, 10) },
      relations: [
        'roles',                    // UserRole[]
        'roles.role',              // Role
        'roles.role.permissions',  // RolePermission[]
        'roles.role.permissions.permission', // Permission
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const mappedUser = this.mapUserToAuthenticatedUser(payload, user);
    
    req.user = mappedUser;
    return true;
  }

  private extractToken(req: Request): string {
    const authHeader = req.headers['authorization'];
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      throw new UnauthorizedException('Token vacío');
    }

    return token;
  }

  private async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }

  private mapUserToAuthenticatedUser(
    payload: JwtPayload,
    user: User,
  ): AuthenticatedUser {
    return {
      sub: payload.sub,
      email: payload.email,
      roles: user.roles?.map((userRole) => {
        return {
          permissions: userRole.role?.permissions?.map((rolePermission) => {
            return {
              name: rolePermission.permission.name,
            };
          }) || [],
        };
      }) || [],
    };
  }

}
