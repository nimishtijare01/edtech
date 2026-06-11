import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('courses')
  async getCourses(@Req() req: any) {
    // In a real app we'd get userId from Supabase JWT guard
    // For now we assume req.user.sub is populated by SupabaseAuthGuard
    const userId = req.user?.sub || 'test-student-id'; 
    return this.studentService.getCourses(userId);
  }

  @Get('courses/:id')
  async getCourseDetails(@Param('id') courseId: string, @Req() req: any) {
    const userId = req.user?.sub || 'test-student-id';
    return this.studentService.getCourseDetails(userId, courseId);
  }

  @Post('progress/:lessonId')
  async updateProgress(
    @Param('lessonId') lessonId: string,
    @Body() body: { timestampSeconds: number; watchedPercentage: number },
    @Req() req: any
  ) {
    const userId = req.user?.sub || 'test-student-id';
    return this.studentService.updateProgress(
      userId,
      lessonId,
      body.timestampSeconds,
      body.watchedPercentage
    );
  }
}
