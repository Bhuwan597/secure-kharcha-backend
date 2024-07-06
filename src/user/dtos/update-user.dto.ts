import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly firstName: string;

  @IsOptional()
  @IsString()
  readonly lastName: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Display name is required.' })
  @IsString()
  readonly displayName: string;

  @IsOptional()
  @IsPhoneNumber('NP', { message: 'Valid esewa number is required.' })
  readonly eSewa: string;


  @IsOptional()
  @IsString()
  readonly photo: string;
}
