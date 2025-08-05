import {
  Injectable,
  OnModuleInit,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '../../generated/prisma';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      omit: {
        url: {
          userId: true,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  // Custom methods
  async findActiveUrls(args?: Prisma.urlFindManyArgs) {
    return this.url.findMany({
      ...args,
      where: {
        ...args?.where,
        deleted: false,
      },
    });
  }

  async findActiveUrlByShortUrl(shortenedUrl: string) {
    return this.url.update({
      where: {
        shortenedUrl,
        deleted: false,
      },
      data: {
        hits: { increment: 1 },
      },
    });
  }

  async findActiveUrlById(id: string, userId?: number) {
    const url = await this.url.findUnique({
      select: {
        userId: true,
        deleted: true,
        user: true,
        originalUrl: true,
      },
      where: {
        id,
      },
    });

    if (!url || url.deleted) throw new NotFoundException('URL not found');

    if (url.userId != userId) {
      throw new ForbiddenException('You do not own this URL');
    }
    return { originalUrl: url.originalUrl };
  }
}
