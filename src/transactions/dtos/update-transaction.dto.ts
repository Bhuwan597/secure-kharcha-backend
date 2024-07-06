import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class UpdateTransactionDto{

    @IsNotEmpty()
    @IsString()
    readonly group: Types.ObjectId

    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNumber()
    readonly amount: number;

    @IsOptional()
    readonly exclude: Types.ObjectId[]

    @IsOptional()
    @IsBoolean()
    readonly split: boolean
}