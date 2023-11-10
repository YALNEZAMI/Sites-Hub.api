import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Site } from 'src/site/entities/site.entity';
@Schema()
export class User {
  password2: string;
  @Prop({ required: false })
  apps?: Site[];
  @Prop()
  name: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop({ required: false })
  image: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
