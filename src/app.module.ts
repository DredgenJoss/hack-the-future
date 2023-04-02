import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller'
import { AppService } from './app.service'
import ormconfig from './ormconfig';
import { FootprintModule } from './private/member/footprint.module';



@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...ormconfig, 
        keepConnectionAlive: true, 
        autoLoadEntities: true
      })
    }),
    FootprintModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
