import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CreateUserDto {
  password2: string;

  @PrimaryGeneratedColumn()
  _id: string;
  @Column()
  user: string;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  image: string;
}
