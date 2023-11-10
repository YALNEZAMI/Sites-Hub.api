import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CreateSiteDto {
  @PrimaryGeneratedColumn()
  _id: string;
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
  createdAt: Date;
  @Column()
  updatedAt: Date;
  @Column()
  OpenedAt: Date;
}
