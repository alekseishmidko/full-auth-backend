import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ProviderOptionsSymbol, TypeOptions } from './provider.constants';
import { BaseOauthService } from './services/base-oauth.service';

@Injectable()
export class ProviderService implements OnModuleInit {
  public constructor(
    @Inject(ProviderOptionsSymbol) private readonly options: TypeOptions,
  ) {}

  public onModuleInit() {
    for (const provider of this.options.services) {
      provider.baseUrl = this.options.baseUrl;
    }
  }

  public findByService(service: string): BaseOauthService | null {
    return this.options.services.find((s) => s.name === service) ?? null;
  }
}
