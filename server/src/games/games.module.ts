import { CacheModule, Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { MongoModule } from 'nest-mongodb'
import { GamesRepository } from './games.repository';

@Module({
  imports: [MongoModule.forFeature(['games'])],
  controllers: [GamesController],
  providers: [GamesService, GamesRepository]
})
export class GamesModule {}
  