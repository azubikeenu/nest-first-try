import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule , ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/reports.entity';
const cookieSession = require('cookie-session'); // we used commonjs style imports because of our compactibility settings in tsconfig files

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true,
      envFilePath :`.env.${process.env.NODE_ENV}`
    }),
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRootAsync({
     inject :[ConfigService],
     useFactory :(config : ConfigService) =>(
      {
          database: config.get<'string'>('DB_NAME'),
          type: 'sqlite',
          entities: [User, Report],
          synchronize: true,
        }
     ),
    })
  ],
  controllers: [AppController],

  providers: [
    AppService,
    {
      // Set up Global Validation Pipe
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      // set up cookieSession
      cookieSession({
        keys: ['Yxuuei8ejnnxnje89jddnk'],
      }),
    ).forRoutes('*');

  }
}
