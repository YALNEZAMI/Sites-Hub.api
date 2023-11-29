/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CreateSiteDto {
  @PrimaryGeneratedColumn()
  _id?: string;
  @Column()
  user: string;
  @Column()
  name: string;
  @Column()
  url: string;
  @Column()
  description: string;
  @Column()
  image: string;
  @Column()
  category: string;
  @Column()
  addDate: Date;
  @Column()
  updatedAt?: Date;
  @Column()
  OpenedAt?: Date;
}
