import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BoardTile, GameDto, Shape } from './types/dto/game.dto';
import { GameStatus } from './types/game.status';
import { GamesRepository } from './games.repository';
import { UserDto } from './types/dto/user.dto';
import { MakeMoveDto } from './types/dto/make-move.dto';

@Injectable()
export class GamesService {
  constructor(
    private readonly gamesRepository: GamesRepository
  ) { }

  async getStaus(id: string): Promise<GameStatus> {
    return (await this.findOne(id)).status;
  }

  async joinGame(id: string, userDto: UserDto) {
    const game = await this.findOne(id);
    if (game.status !== GameStatus.PENDING_START) {
      throw new BadRequestException('Game is not in PENDING_START status');
    }
    const isFirstToJoin = game.user1 === null;
    if (isFirstToJoin === false && game.user1.shape === userDto.shape) {
      throw new BadRequestException('The input shape is already taken');
    }
    await this.gamesRepository.joinGame(id, userDto, isFirstToJoin);
  }

  async createGame(): Promise<string> {
    const board: BoardTile[][] = [
      new Array<BoardTile>(3).fill(null),
      new Array<BoardTile>(3).fill(null),
      new Array<BoardTile>(3).fill(null),
    ];
    const gameDto: GameDto = {
      id: randomUUID(),
      board: board,
      status: GameStatus.PENDING_START
    };
    await this.gamesRepository.createGame(gameDto);
    return gameDto.id;
  }

  private async findOne(id: string): Promise<GameDto> {
    const game = await this.gamesRepository.findGameById(id);
    if (game === undefined) {
      throw new NotFoundException('Game not found');
    }
    return game;
  }

  async makeMove(id: string, makeMoveDto: MakeMoveDto): Promise<void> {
    const game = await this.findOne(id);
    if (game.status !== GameStatus.PLAYING) {
      throw new BadRequestException('Cannot make moves in games with status different than GameStatus.PLAYING');
    }
    const { x, y } = makeMoveDto;
    if (game.board[x][y] !== null) {
      throw new BadRequestException('Cannot make moves on board place that already has a piece on it');
    }
    game.board[x][y] = game.nextTurn;
    const newStatus = this.calculateGameStatusFromBoard(game.board);
    await this.gamesRepository.makeMove(id, makeMoveDto,
      game.nextTurn, newStatus);
  }


  private calculateGameStatusFromBoard(board: BoardTile[][]): GameStatus {
    //TODO: we can save time and calculate status from the 5th turn
    if (this.isWinner('X', board)) return GameStatus.X_WON;
    if (this.isWinner('O', board)) return GameStatus.O_WON;
    return this.isLastTurn(board) ? GameStatus.Tie : GameStatus.PLAYING;
  }

  private isLastTurn(board: BoardTile[][]): boolean {
    const flatBoard = board.reduce((accumulator, value) => accumulator.concat(value), []);
    return flatBoard.every((tile: BoardTile) => tile !== null);
  }

  private isWinner(shape: Shape, board: BoardTile[][]): boolean {
    const isIdentical = (values: BoardTile[]) => values.every((tile: BoardTile) => tile === shape);
    // check rows
    if (isIdentical(board[0]) || isIdentical(board[1])
      || isIdentical(board[2]))
      return true;
    // check columns
    if (isIdentical([board[0][0], board[1][0], board[2][0]])
      || isIdentical([board[0][1], board[1][1], board[2][1]])
      || isIdentical([board[0][2], board[1][2], board[2][2]]))
      return true;
    // check diagonals
    if (isIdentical([board[0][0], board[1][1], board[2][2]])
      || isIdentical([board[0][2], board[1][1], board[2][0]]))
      return true;
    return false;
  }
}
