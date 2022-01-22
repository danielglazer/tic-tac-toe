import { BoardTile, GameDto, Shape } from "../dto/game.dto";
import { UserDto } from "../dto/user.dto";
import { GameStatus } from "../game.status";

export class GameEntity implements GameDto{
  user1?: UserDto;
  user2?: UserDto;
  nextTurn?: Shape;
  
  id: string;
  board: BoardTile[][];
  status: GameStatus;
}


