import { IsString, IsUUID, Matches } from 'class-validator';

export class CategoryDto {
  @IsUUID()
  id: string;

  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, { message: 'nombre de categoria invalido' })
  name: string;
}
