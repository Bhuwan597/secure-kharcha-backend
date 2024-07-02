import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
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

  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsPhoneNumber('NP', { message: 'Valid esewa number is required.' })
  readonly eSewa: string;

  @IsNotEmpty({ message: 'Provider is required.' })
  @IsString()
  readonly provider: string;

  @IsOptional()
  @IsString()
  readonly photo: string;
}
