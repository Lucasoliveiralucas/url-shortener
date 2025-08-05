import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) {
      request.user = null;
      return true;
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request.user = payload;
      return true;
    } catch {
      return false;
    }
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    return null;
  }
}
