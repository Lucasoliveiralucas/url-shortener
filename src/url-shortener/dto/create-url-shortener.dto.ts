import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateUrlShortenerDto {
  @ApiProperty({ example: 'https://example.com' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;
}
