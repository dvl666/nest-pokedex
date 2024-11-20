import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    @IsPositive()
    @Min(1)
    @IsOptional()
    offset?: number;

    @IsPositive()
    @Min(1)
    @IsOptional()
    limit?: number;
}