import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Site {
  @Prop({ required: true })
  user: string;
  @Prop()
  name: string;
  @Prop()
  url: string;
  @Prop({ required: false })
  description: string;
  @Prop()
  image: string;
  @Prop()
  category: string;
  @Prop({ required: false })
  addDate: Date;
  @Prop({ required: false })
  updateDate: Date;
  @Prop({ required: false })
  lastOpenDate: Date;
}
export const SiteSchema = SchemaFactory.createForClass(Site);
export type SiteDocument = Site & Document;
