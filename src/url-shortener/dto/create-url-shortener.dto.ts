import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateUrlShortenerDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;
}
