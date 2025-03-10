import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';

@Module({
  controllers: [],
  providers: [ProviderService],
})
export class ProviderModule {}
