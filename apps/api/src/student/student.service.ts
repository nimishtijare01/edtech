import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async getCourses(userId: string) {
    // 1. Get courses user bought explicitly via Payment
    const payments = await this.prisma.payment.findMany({
      where: { studentId: userId, status: 'SUCCESS' },
      select: { course: true }
    });
    
    // 2. Get courses part of a Batch the user is in
    const batches = await this.prisma.batch.findMany({
      where: { students: { some: { id: userId } } },
      include: { courses: true }
    });

    const courses = new Map();
    payments.forEach(p => courses.set(p.course.id, p.course));
    batches.forEach(b => b.courses.forEach(c => courses.set(c.id, c)));

    return Array.from(courses.values());
  }

  async getCourseDetails(userId: string, courseId: string) {
    // Basic verification they have access
    const courses = await this.getCourses(userId);
    if (!courses.find(c => c.id === courseId)) {
      throw new NotFoundException('Course not found or access denied');
    }

    return this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                attachments: true,
                progress: {
                  where: { userId }
                }
              }
            }
          }
        }
      }
    });
  }

  async updateProgress(userId: string, lessonId: string, timestampSeconds: number, watchedPercentage: number) {
    return this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      },
      update: {
        timestampSeconds,
        watchedPercentage,
        completed: watchedPercentage >= 90
      },
      create: {
        userId,
        lessonId,
        timestampSeconds,
        watchedPercentage,
        completed: watchedPercentage >= 90
      }
    });
  }
}
