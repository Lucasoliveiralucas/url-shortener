import { Injectable } from '@nestjs/common';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import { UpdateUrlShortenerDto } from './dto/update-url-shortener.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { randomBytes } from 'crypto';
import { DatabaseService } from 'src/database/database.service';
import type { Request } from 'express';

@Injectable()
export class UrlShortenerService {
  constructor(private databaseSevice: DatabaseService) {}

  async create(
    createUrlShortenerDto: CreateUrlShortenerDto,
    req: Request,
    user?: JwtPayload,
  ) {
    const url = await this.databaseSevice.url.create({
      data: {
        id: crypto.randomUUID(),
        originalUrl: createUrlShortenerDto.originalUrl,
        shortenedUrl: await this.generateUniqueShortCode(),
        userId: user?.sub || null,
      },
    });

    const fullUrl = `${req.protocol}://${req.get('host')}/${url.shortenedUrl}`;
    return fullUrl;
  }

  findAll() {
    return `This action returns all urlShortener`;
  }

  findOne(id: number) {
    return `This action returns a #${id} urlShortener`;
  }

  update(id: number, updateUrlShortenerDto: UpdateUrlShortenerDto) {
    return `This action updates a #${id} urlShortener`;
  }

  remove(id: number) {
    return `This action removes a #${id} urlShortener`;
  }

  private generateShortCode(length = 6): string {
    return randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  private async generateUniqueShortCode(): Promise<string> {
    const maxAttempts = 5;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const code = this.generateShortCode();
      const exists = await this.databaseSevice.url.findUnique({
        where: { shortenedUrl: code },
      });

      if (!exists) return code;
    }

    throw new Error('Could not generate a unique short code');
  }
}
