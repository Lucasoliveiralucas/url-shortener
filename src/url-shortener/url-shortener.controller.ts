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
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import type { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('urls')
@Controller('url-shortener')
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async create(
    @Body() createUrlShortenerDto: CreateUrlShortenerDto,
    @User() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.urlShortenerService.create(createUrlShortenerDto, req, user);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  findAll(@User() user: JwtPayload) {
    return this.urlShortenerService.findAll(user);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @User() user: JwtPayload) {
    return this.urlShortenerService.findOne(id, user);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUrlShortenerDto: UpdateUrlShortenerDto,
    @User() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.urlShortenerService.update(
      id,
      updateUrlShortenerDto,
      user,
      req,
    );
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: JwtPayload) {
    return this.urlShortenerService.remove(id, user);
  }
}
