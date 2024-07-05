import { IsOptional, IsString } from "class-validator";

export class UpdateGroupDto{
    @IsString()
    @IsOptional()
    readonly name: string;
    
    @IsString()
    @IsOptional()
    readonly description: string;
    
    @IsString()
    @IsOptional()
    readonly photo: string;

}