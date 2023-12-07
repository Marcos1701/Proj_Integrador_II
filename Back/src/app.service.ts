import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Bem vindo a API do app de finanças pessoais, vulgo FinnApp 😎😎';
  }
}
