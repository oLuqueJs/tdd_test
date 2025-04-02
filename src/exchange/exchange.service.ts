import { BadRequestException, Injectable } from '@nestjs/common';

export class CurrenciesService {
  async getCurrency(currency: string): Promise<any> {}
}

@Injectable()
export class ExchangeService {
  constructor(private currenciesService: CurrenciesService) {}

  async convertAmount({ from, to, amount, }): Promise<any> {
    if (!from || !to || !amount)  {
      throw new BadRequestException(); 
    }
    const currencyFrom = this.currenciesService.getCurrency('USD');
    const currencyFrom2 = this.currenciesService.getCurrency('BRL');
  }


}
