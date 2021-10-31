import { RedisModule } from '@nestjs-modules/ioredis';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerController } from './controllers/player.controller';
import { RankingController } from './controllers/ranking.controller';
import { Player } from './entities/player.entity';
import { Ranking } from './entities/ranking.entity';
import { Winner } from './entities/winner.entity';
import { MobileAuthMiddleware } from './middlewares/mobile-auth.middleware';
import { PlayerService } from './services/player.service';
import { RankingService } from './services/ranking.service';
import { CLIENT_NAME } from './utils/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    RedisModule.forRoot({
      config: {
        url: 'redis://localhost:6379',
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER') || '',
        password: configService.get<string>('DB_PASSWORD') || '',
        database: configService.get<string>('DB_NAME'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Player, Ranking, Winner]),
  ],
  controllers: [RankingController, PlayerController],
  providers: [RankingService, PlayerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MobileAuthMiddleware).forRoutes('rankings');
  }
}
