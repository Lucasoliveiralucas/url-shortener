import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import { UpdateUrlShortenerDto } from './dto/update-url-shortener.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { randomBytes } from 'crypto';
import { DatabaseService } from 'src/database/database.service';
import type { Request } from 'express';

@Injectable()
export class UrlShortenerService {
  constructor(private databaseService: DatabaseService) {}

  async create(
    createUrlShortenerDto: CreateUrlShortenerDto,
    req: Request,
    user?: JwtPayload,
  ) {
    const url = await this.databaseService.url.create({
      data: {
        id: crypto.randomUUID(),
        originalUrl: createUrlShortenerDto.originalUrl,
        shortenedUrl: await this.generateUniqueShortCode(),
        userId: user?.sub || null,
      },
    });

    const fullUrl = `${req.protocol}://${req.get('host')}/${url.shortenedUrl}`;
    return { shortUrl: fullUrl, id: url.id };
  }

  async findAll(user?: JwtPayload) {
    if (!user?.sub) throw new ForbiddenException('Please sign in to continue');

    return this.databaseService.findActiveUrls({
      where: {
        userId: user.sub,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, user?: JwtPayload) {
    const url = await this.databaseService.findActiveUrlById(id, user?.sub);

    return url;
  }

  async update(
    id: string,
    dto: UpdateUrlShortenerDto,
    user?: JwtPayload,
    req?: Request,
  ) {
    const url = await this.databaseService.findActiveUrlById(id, user?.sub);

    const updated = await this.databaseService.url.update({
      where: { id },
      data: {
        originalUrl: dto.originalUrl || url.originalUrl,
      },
    });

    const fullUrl = `${req?.protocol}://${req?.get('host')}/${updated.shortenedUrl}`;
    return { updatedUrl: fullUrl };
  }

  async remove(id: string, user?: JwtPayload) {
    const url = await this.databaseService.findActiveUrlById(id, user?.sub);

    await this.databaseService.url.update({
      where: { id },
      data: { deleted: new Date() },
    });

    return { message: 'URL soft-deleted successfully' };
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
      const exists = await this.databaseService.url.findUnique({
        where: { shortenedUrl: code },
      });

      if (!exists) return code;
    }

    throw new Error('Could not generate a unique short code');
  }
}
