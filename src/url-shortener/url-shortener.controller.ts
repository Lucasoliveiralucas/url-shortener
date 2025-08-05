import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import { UpdateUrlShortenerDto } from './dto/update-url-shortener.dto';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import type { Request } from 'express';

@Controller('url-shortener')
export class UrlShortenerController {
  constructor(
    private readonly urlShortenerService: UrlShortenerService,
    private jwt: JwtService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async create(
    @Body() createUrlShortenerDto: CreateUrlShortenerDto,
    @User() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.urlShortenerService.create(createUrlShortenerDto, req, user);
  }

  @Get()
  findAll() {
    return this.urlShortenerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.urlShortenerService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUrlShortenerDto: UpdateUrlShortenerDto,
  ) {
    return this.urlShortenerService.update(+id, updateUrlShortenerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.urlShortenerService.remove(+id);
  }
}
