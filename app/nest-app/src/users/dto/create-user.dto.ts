import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: String;

  @IsEmail({}, { message: 'use a valid email format' })
  email: String;
}
