import { IsString } from "class-validator";
import { Shape } from "./game.dto";

export class UserDto {
  @IsString()
  displayName: string;
  shape: Shape;
}
