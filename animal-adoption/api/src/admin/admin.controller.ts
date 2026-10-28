import { Body, Controller, Delete, Get, Param, Patch, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { AdminService } from './admin.service.js';

@Controller('admin')
export class AdminController {
  constructor(private prisma: PrismaService, private adminService: AdminService) {}

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.adminService.login(body.email, body.password);
  }

  @Get('animals')
  @UseGuards(JwtAuthGuard, new RolesGuard(2))
  listAnimals() {
    return this.prisma.animal.findMany({ include: { user: true, species: true, status: true } });
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, new RolesGuard(2))
  listUsers() {
    return this.prisma.user.findMany({ include: { role: true } });
  }

  @Delete('animals/:id')
  @UseGuards(JwtAuthGuard, new RolesGuard(2))
  deleteAnimal(@Param('id', ParseIntPipe) id: number) {
    return this.prisma.animal.delete({ where: { id } });
  }

  @Patch('users/:id/ban')
  @UseGuards(JwtAuthGuard, new RolesGuard(2))
  async banUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');
    return this.prisma.user.update({ where: { id }, data: { banned: !user.banned } });
  }
}
