import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerService } from './url-shortener.service';
import { ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import { UpdateUrlShortenerDto } from './dto/update-url-shortener.dto';
import { DatabaseService } from '../database/database.service';

describe('UrlShortenerService', () => {
  let service: UrlShortenerService;
  let db: DatabaseService;

  const mockDatabaseService = {
    url: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    findActiveUrls: jest.fn(),
    findActiveUrlById: jest.fn(),
  };

  const mockRequest = {
    protocol: 'http',
    get: jest.fn().mockReturnValue('localhost:3000'),
  } as unknown as Request;

  const mockUser = { sub: 1, email: 'johnDoe@example.com' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlShortenerService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<UrlShortenerService>(UrlShortenerService);
    db = module.get<DatabaseService>(DatabaseService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a short URL', async () => {
      const dto: CreateUrlShortenerDto = {
        originalUrl: 'https://example.com',
      };

      jest.spyOn(service as any, 'generateShortCode').mockReturnValue('abcdef');

      (db.url.findUnique as jest.Mock).mockResolvedValue(null);
      (db.url.create as jest.Mock).mockResolvedValue({
        id: 'url-123',
        shortenedUrl: 'abcdef',
      });

      const result = await service.create(dto, mockRequest, mockUser);

      expect(result).toEqual({
        shortUrl: 'http://localhost:3000/abcdef',
        id: 'url-123',
      });
    });
  });

  describe('findAll', () => {
    it('should throw if no user is provided', async () => {
      await expect(service.findAll()).rejects.toThrow(ForbiddenException);
    });

    it('should return user URLs', async () => {
      (db.findActiveUrls as jest.Mock).mockResolvedValue([
        { id: 'url-1' },
        { id: 'url-2' },
      ]);

      const result = await service.findAll(mockUser);

      expect(result).toHaveLength(2);
      expect(db.findActiveUrls).toHaveBeenCalledWith({
        where: { userId: mockUser.sub },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return the found URL', async () => {
      (db.findActiveUrlById as jest.Mock).mockResolvedValue({ id: 'url-123' });

      const result = await service.findOne('url-123', mockUser);

      expect(result).toEqual({ id: 'url-123' });
    });
  });

  describe('update', () => {
    it('should update the URL and return updatedUrl', async () => {
      (db.findActiveUrlById as jest.Mock).mockResolvedValue({
        id: 'url-123',
        originalUrl: 'https://old.com',
        shortenedUrl: 'abcdef',
      });

      (db.url.update as jest.Mock).mockResolvedValue({
        shortenedUrl: 'abcdef',
      });

      const dto: UpdateUrlShortenerDto = {
        originalUrl: 'https://new.com',
      };

      const result = await service.update(
        'url-123',
        dto,
        mockUser,
        mockRequest,
      );

      expect(result).toEqual({
        updatedUrl: 'http://localhost:3000/abcdef',
      });
    });
  });

  describe('remove', () => {
    it('should soft delete the URL', async () => {
      (db.findActiveUrlById as jest.Mock).mockResolvedValue({ id: 'url-123' });
      (db.url.update as jest.Mock).mockResolvedValue({});

      const result = await service.remove('url-123', mockUser);

      expect(result).toEqual({ message: 'URL soft-deleted successfully' });
      expect(db.url.update).toHaveBeenCalledWith({
        where: { id: 'url-123' },
        data: { deleted: expect.any(Date) },
      });
    });
  });

  describe('generateUniqueShortCode', () => {
    it('should generate a unique code', async () => {
      jest
        .spyOn(service as any, 'generateShortCode')
        .mockReturnValueOnce('abcdef');

      (db.url.findUnique as jest.Mock).mockResolvedValue(null);

      const code = await (service as any).generateUniqueShortCode();

      expect(code).toBe('abcdef');
    });

    it('should throw after max attempts', async () => {
      jest.spyOn(service as any, 'generateShortCode').mockReturnValue('abcdef');

      (db.url.findUnique as jest.Mock).mockResolvedValue({ id: 'some-url' });

      await expect((service as any).generateUniqueShortCode()).rejects.toThrow(
        'Could not generate a unique short code',
      );
    });
  });
});
