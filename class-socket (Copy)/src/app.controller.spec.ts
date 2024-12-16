import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Response } from 'express';  // Pastikan import Response dari express

describe('AppController', () => {
  let appController: AppController;
  let mockResponse: Partial<Response>;  // Membuat mock Response

  beforeEach(async () => {
    mockResponse = {
      // Menambahkan method mock yang diperlukan
      send: jest.fn().mockReturnThis(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should return "Hello World!"', async () => {
    // Panggil method getHello dengan mock Response
    await appController.getHello(mockResponse as Response);
    expect(mockResponse.send).toHaveBeenCalledWith('Hello World!');
  });
});
