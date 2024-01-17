import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
