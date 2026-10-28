import { Controller, Post, Get, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { AnimalsService } from './animals.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: { name: string; speciesId: number; details: string; requirements: string; imageUrl?: string }, @Request() req: { user: { sub: number } }) {
    return this.animalsService.create(dto, req.user.sub);
  }

  @Get()
  findAll() {
    return this.animalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.animalsService.findOne(id);
  }
}
