import { GameDto, Shape } from "./types/dto/game.dto";
import { GameEntity } from "./types/entities/game.entity";
import { Collection, Db } from 'mongodb';
import { InjectDb, InjectCollection } from 'nest-mongodb';
import { BadGatewayException } from "@nestjs/common";
import { UserDto } from "./types/dto/user.dto";
import { GameStatus } from "./types/game.status";
import { MakeMoveDto } from "./types/dto/make-move.dto";

export class GamesRepository {
  constructor(
    @InjectCollection('games') private readonly collection: Collection<GameEntity>,
    @InjectDb() private readonly db: Db
  ) {
    this.collection = this.db.collection<GameEntity>('games');
  }

  async findGameById(id: string): Promise<GameDto | undefined> {
    const gameEntity = await this.collection.findOne({ id: id });
    if (gameEntity === null) return undefined;
    return this.gameEntityToDto(gameEntity);
  }

  async createGame(gameDto: GameDto): Promise<void> {
    const gameEntity = await this.collection.findOne({ id: gameDto.id });
    if (gameEntity !== null) {
      throw new BadGatewayException('Game with this id already exists');
    }
    await this.collection.insertOne(this.gameDtoToEntity(gameDto));
  }

  async joinGame(id: string, userDto: UserDto, isFirstToJoin: boolean) {
    if (isFirstToJoin) {
      await this.collection.findOneAndUpdate(
        { id: id },
        { $set: { user1: userDto } },
      );
    } else {
      await this.collection.findOneAndUpdate(
        { id: id },
        {
          $set: {
            user2: userDto, status: GameStatus.PLAYING,
            nextTurn: (userDto.shape === 'O' ? 'X' : 'O'),
          }
        },
      );
    }
  }

  async makeMove(id: string, makeMoveDto: MakeMoveDto,
    shape: Shape, status: GameStatus) {
    const { x, y } = makeMoveDto;
    await this.collection.findOneAndUpdate(
      { id: id },
      {
        $set: {
          status: status,
          [`board.${x}.${y}`]: shape,
          nextTurn: (shape === 'O' ? 'X' : 'O'),
        }
      },
    );
  }


  gameEntityToDto(gameEntity: GameEntity): GameDto {
    const gameDto = (({ id, board, status, user1, user2, nextTurn }) => ({ id, board, status, user1, user2, nextTurn }))(gameEntity);
    return gameDto;
  }

  gameDtoToEntity(gameDto: GameDto): GameEntity {
    const gameEntity = (({ id, board, status, user1, user2, nextTurn }) => ({ id, board, status, user1, user2, nextTurn }))(gameDto);
    return gameEntity;
  }
}