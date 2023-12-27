import { ConfigService } from '@nestjs/config';

import { Injectable } from '@nestjs/common';
import { MongooseOptionsFactory } from '@nestjs/mongoose';
import { MongooseModuleOptions } from '@nestjs/mongoose/dist/interfaces';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private ConfigService: ConfigService) {}

  createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    const DB_HOST = this.ConfigService.get('DB_HOST');
    const DB_PORT = this.ConfigService.get('DB_PORT');
    const DB_NAME = this.ConfigService.get('DB_NAME');

    const uri = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    console.log(uri);
    return {
      uri,
    };
  }
}
