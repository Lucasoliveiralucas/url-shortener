import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const accessToken = await this.authService.signUp(dto);
      this.setAuthCookie(res, accessToken);
      return { accessToken };
    } catch (error) {
      this.handleError(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const accessToken = await this.authService.signIn(dto);
      this.setAuthCookie(res, accessToken);
      return { accessToken };
    } catch (error) {
      this.handleError(error);
    }
  }

  private setAuthCookie(res: Response, token: string): void {
    res.cookie('accessToken', `Bearer ${token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60,
    });
  }

  private handleError(error: any): never {
    if (error?.message?.includes('Invalid credentials')) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (error?.message?.includes('Credentials taken')) {
      throw new BadRequestException('User with this email already exists.');
    }

    throw new InternalServerErrorException('Something went wrong.');
  }
}
