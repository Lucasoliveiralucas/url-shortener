import { Module } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlShortenerController } from './url-shortener.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/auth.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],

  controllers: [UrlShortenerController],
  providers: [UrlShortenerService, JwtStrategy],
})
export class UrlShortenerModule {}
