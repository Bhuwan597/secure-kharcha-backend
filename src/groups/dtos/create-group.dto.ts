import { IsNotEmpty, IsString } from "class-validator";

export class CreateGroupDto{
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

}