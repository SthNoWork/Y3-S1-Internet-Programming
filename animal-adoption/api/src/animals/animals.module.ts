import { Module } from '@nestjs/common';
import { AnimalsService } from './animals.service.js';
import { AnimalsController } from './animals.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [AnimalsController],
  providers: [AnimalsService],
})
export class AnimalsModule {}
