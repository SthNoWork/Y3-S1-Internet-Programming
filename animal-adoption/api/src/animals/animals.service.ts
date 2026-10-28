import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AnimalsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: { name: string; speciesId: number; details: string; requirements: string; imageUrl?: string }, userId: number) {
    return this.prisma.animal.create({
      data: {
        name: dto.name,
        details: dto.details,
        requirements: dto.requirements,
        imageUrl: dto.imageUrl,
        species: { connect: { id: dto.speciesId } },
        user: { connect: { id: userId } },
        status: { connect: { id: 1 } }, // default to available
      },
    });
  }

  async findAll() {
    return this.prisma.animal.findMany({
      where: {
        statusId: 1, // available
        user: { banned: false },
      },
      include: {
        species: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.animal.findFirst({
      where: { id },
      include: {
        species: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }
}
