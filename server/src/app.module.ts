import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { MongoModule } from 'nest-mongodb'

@Module({
  imports: [
    MongoModule.forRoot('mongodb://localhost', 'TicTacToe'),
    GamesModule,
  ],
})
export class AppModule { }
