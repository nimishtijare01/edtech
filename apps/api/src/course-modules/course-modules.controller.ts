import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { CourseModulesService } from './course-modules.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { SupabaseAuthGuard } from '../auth/supabase.guard';

@Controller('course-modules')
@UseGuards(SupabaseAuthGuard)
export class CourseModulesController {
  constructor(private readonly courseModulesService: CourseModulesService) {}

  @Post()
  create(@Body() createCourseModuleDto: CreateCourseModuleDto, @Req() req: any) {
    return this.courseModulesService.create(createCourseModuleDto, req.user);
  }

  @Get()
  findAll(@Req() req: any, @Query('courseId') courseId?: string) {
    return this.courseModulesService.findAll(req.user, courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseModulesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseModuleDto: UpdateCourseModuleDto, @Req() req: any) {
    return this.courseModulesService.update(id, updateCourseModuleDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.courseModulesService.remove(id, req.user);
  }
}
