import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKeyHeader = request.headers['x-api-key'] || request.headers['api-key'];
    const apiKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;
    if (!apiKey) throw new UnauthorizedException('Missing API key');

    const validateInDb = this.configService.get<string>('VALIDATE_APIKEY_IN_DB');
    if (validateInDb === 'true') {
      // Validar en la base de datos
      const apikey = await this.prisma.apikey.findFirst({
        where: {
          valor: apiKey,
          activo: true,
        },
      });
      if (!apikey) {
        throw new UnauthorizedException('Invalid API key (DB)');
      }
      return true;
    } else {
      // Validar contra variable de entorno
      const validApiKey = this.configService.get<string>('API_KEY');
      if (apiKey !== validApiKey) {
        throw new UnauthorizedException('Invalid API key');
      }
      return true;
    }
  }
}
