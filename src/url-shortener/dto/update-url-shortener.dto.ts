import { PartialType } from '@nestjs/mapped-types';
import { CreateUrlShortenerDto } from './create-url-shortener.dto';

export class UpdateUrlShortenerDto extends PartialType(CreateUrlShortenerDto) {}
