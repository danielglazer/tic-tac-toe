import { IsInt, Min, Max } from "class-validator";

export class MakeMoveDto {
  @IsInt()
  @Min(0)
  @Max(2)
  x: number;
  @IsInt()
  @Min(0)
  @Max(2)
  y: number;
}