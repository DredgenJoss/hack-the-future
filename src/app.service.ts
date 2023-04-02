import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): any {
    return {
      SERVICE: 'htf',
      APP_ENV: process.env.APP_ENV,
    }
  }
}
