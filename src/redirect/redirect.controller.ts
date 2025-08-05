import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { RedirectService } from './redirect.service';

@Controller()
export class RedirectController {
  constructor(private readonly redirectService: RedirectService) {}

  @Get(':code')
  async redirect(@Param('code') code: string, @Res() res: Response) {
    const originalUrl = await this.redirectService.getOriginalUrl(code);
    if (!originalUrl) throw new NotFoundException('URL not found');
    return res.redirect(originalUrl);
  }
}
