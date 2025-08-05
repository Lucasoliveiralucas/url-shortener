import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private databaseSevice: DatabaseService,
    private jwt: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.databaseSevice.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      throw new ForbiddenException('Credentials taken');
    }
  }

  async signIn(dto: SignInDto) {
    const user = await this.databaseSevice.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException('Invalid credentials');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Invalid credentials');

    return this.signToken(user.id, user.email);
  }

  private signToken(userId: number, email: string): string {
    const payload = { sub: userId, email };
    const accessToken = this.jwt.sign(payload);
    return accessToken;
  }
}
