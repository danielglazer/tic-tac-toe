import { Controller, Get, Post, Param, Put, ParseUUIDPipe, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { GamesService } from './games.service';
import { MakeMoveDto } from './types/dto/make-move.dto';
import { UserDto } from './types/dto/user.dto';
import { GameStatus } from './types/game.status';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createGame() {
    return this.gamesService.createGame();
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async joinGame(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() userDto: UserDto) {
    return this.gamesService.joinGame(id, userDto);
  }

  @Get(':id/status')
  async getGameStatus(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string)
    : Promise<GameStatus> {
    return this.gamesService.getStaus(id);
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id/move')
  async makeMove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, 
  @Body() makeMoveDto: MakeMoveDto): Promise<void> {
    return this.gamesService.makeMove(id, makeMoveDto);
  }

}
