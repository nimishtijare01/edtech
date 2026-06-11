import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { SupabaseAuthGuard } from '../auth/supabase.guard';

@Controller('lessons')
@UseGuards(SupabaseAuthGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  create(@Body() createLessonDto: CreateLessonDto, @Req() req: any) {
    return this.lessonsService.create(createLessonDto, req.user);
  }

  @Get()
  findAll(@Req() req: any, @Query('moduleId') moduleId?: string) {
    return this.lessonsService.findAll(req.user, moduleId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto, @Req() req: any) {
    return this.lessonsService.update(id, updateLessonDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.lessonsService.remove(id, req.user);
  }

  @Post(':id/progress')
  markProgress(
    @Param('id') id: string, 
    @Req() req: any, 
    @Body() body: { completed: boolean, timestampSeconds?: number, watchedPercentage?: number }
  ) {
    return this.lessonsService.markProgress(id, req.user, body.completed, body.timestampSeconds, body.watchedPercentage);
  }
}
