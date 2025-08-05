import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RedirectService {
  constructor(private databaseSevice: DatabaseService) {}

  async getOriginalUrl(shortenedUrl: string) {
    const url = await this.databaseSevice.findActiveUrlByShortUrl(shortenedUrl);

    return url?.originalUrl;
  }
}
