import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RedirectService {
  constructor(private databaseSevice: DatabaseService) {}

  async getOriginalUrl(shortenedUrl: string) {
    const url = await this.databaseSevice.url.findUnique({
      where: { shortenedUrl },
    });

    return url?.originalUrl;
  }
}
