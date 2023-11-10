import { Module } from '@nestjs/common';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { Site, SiteSchema } from './entities/site.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  exports: [SiteService],
  imports: [
    MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }]),
  ],
  controllers: [SiteController],
  providers: [SiteService],
})
export class SiteModule {}
