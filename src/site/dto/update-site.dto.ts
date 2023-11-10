import { PartialType } from '@nestjs/mapped-types';
import { CreateSiteDto } from './create-site.dto';

export class UpdateSiteDto extends PartialType(CreateSiteDto) {
  name?: string;
  url?: string;
  description?: string;
  image?: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
  OpenedAt?: Date;
}
