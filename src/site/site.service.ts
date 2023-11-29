/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SiteDocument } from './entities/site.entity';
import { Model } from 'mongoose';
@Injectable()
export class SiteService {
  constructor(
    @InjectModel('Site') private readonly siteModel: Model<SiteDocument>,
  ) {}
  async create(createSiteDto: CreateSiteDto) {
    const site = await this.siteModel.create(createSiteDto);
    return {
      status: 200,
      message: 'Site created successfully',
      site: site,
    };
  }

  findAll() {
    return this.siteModel.find().exec();
  }
  findAppsOfUser(id: string) {
    return this.siteModel.find({ user: id }).exec();
  }

  findOne(id: string) {
    return this.siteModel.findById(id).exec();
  }

  async update(id: string, updateSiteDto: UpdateSiteDto) {
    try {
      await this.siteModel.updateOne({ _id: id }, updateSiteDto).exec();
      const updatedApp = await this.findOne(id);
      return {
        status: 200,
        message: 'Site updated successfully',
        app: updatedApp,
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Update site failed',
      };
    }
  }

  async remove(id: string): Promise<any> {
    try {
      await this.siteModel.deleteOne({ _id: id }).exec();
      return {
        status: 200,
        message: 'Site deleted successfully',
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Delete site failed',
      };
    }
  }
  deleteAllOfUser(id: string): any {
    return this.siteModel.deleteMany({ user: id }).exec();
  }
}
