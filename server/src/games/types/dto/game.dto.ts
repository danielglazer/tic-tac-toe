import { GameStatus } from "../game.status";
import { UserDto } from "./user.dto";

export interface GameDto {
  user1?: UserDto;
  user2?: UserDto;
  nextTurn?: Shape;
  
  id: string;
  board: BoardTile[][];
  status: GameStatus;
}

export type Shape = 'O' | 'X';
export type BoardTile =  Shape | null;

