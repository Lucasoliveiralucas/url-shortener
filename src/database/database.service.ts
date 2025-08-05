import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { PrismaClient, Prisma } from '../../generated/prisma';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      omit: {
        url: {
          userId: true,
          deleted: true,
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
    const url = await this.url.findFirst({
      where: {
        id,
        deleted: false,
        userId: userId || null,
      },
    });

    if (!url) throw new NotFoundException('URL not found');

    return url;
  }
}
