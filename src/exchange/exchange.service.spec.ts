import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesService, ExchangeService } from './exchange.service';
import { BadRequestException } from '@nestjs/common';


describe('ExchangeService', () => {
  let service: ExchangeService;
  let currenciesService: CurrenciesService

  beforeEach(async () => {
    const currenciesServiceMock = {
      getCurrency: jest.fn().mockReturnValue({ value: 1 })
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        {
          provide: CurrenciesService, useFactory: () => currenciesServiceMock
        }
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
    currenciesService = module.get<CurrenciesService>(CurrenciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertAmount()', () => {
    it('should be throw if called with invalid params', async () => {
      await expect(
        service.convertAmount({from: '', to:'', amount: 0}),
    ).rejects.toThrow(new BadRequestException());
    });

    it('should not throw if called with valid params', async () => {
      await expect(
        service.convertAmount({from: 'USD', to: 'BRL', amount: 1}),
    ).resolves.not.toThrow();
    });

    it('should be called getCurrency twice', async () => {
      await service.convertAmount({from: 'USD', to: 'BRL', amount: 1}),
      await expect(currenciesService.getCurrency).toHaveBeenCalledTimes(2);
    });

    it('should be called getCurrency with correct params', async () => {
      await service.convertAmount({from: 'USD', to: 'BRL', amount: 1}),
      await expect(currenciesService.getCurrency).toHaveBeenCalledWith('USD')
      await expect(currenciesService.getCurrency).toHaveBeenCalledWith('BRL')
    });

    it('should be throw getCurrency with correct throw', async () => {
      (currenciesService.getCurrency as jest.Mock).mockRejectedValue(new Error())
      await expect(
       service.convertAmount({from: 'INVALID', to: 'BRL', amount: 1}),
    ).rejects.toThrow()
    });

    it('should be return conversion value', async () => {
      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 1 });
      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 1 });
      (currenciesService.getCurrency )
      expect(await service.convertAmount({ from: 'USD', to: 'USD', amount: 1})).toEqual({
        amount: 1, 
      });

      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 1 });
      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 0.2 });
      (currenciesService.getCurrency )
      expect(await service.convertAmount({ from: 'USD', to: 'BRL', amount: 1})).toEqual({
        amount: 5, 
      });

      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 0.2 });
      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 1 });
      (currenciesService.getCurrency )
      expect(await service.convertAmount({ from: 'BRL', to: 'USD', amount: 1})).toEqual({
        amount: 0.2, 
      });
    });
  });
});
