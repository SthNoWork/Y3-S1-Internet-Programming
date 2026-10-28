import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AnimalsModule } from './animals/animals.module.js';
import { AdminModule } from './admin/admin.module.js';

@Module({
  imports: [PrismaModule, AuthModule, AnimalsModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [PrismaModule],
})
export class AppModule {}
