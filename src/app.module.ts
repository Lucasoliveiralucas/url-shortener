import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UrlShortenerModule } from './url-shortener/url-shortener.module';
import { RedirectModule } from './redirect/redirect.module';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UrlShortenerModule,
    RedirectModule,
    DatabaseService,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
