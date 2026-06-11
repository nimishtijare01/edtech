import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLessonDto: CreateLessonDto, user: any) {
    const { moduleId, ...data } = createLessonDto;

    const module = await this.prisma.courseModule.findUnique({
      where: { id: moduleId },
      include: { course: { include: { batch: { include: { institute: true } } } } },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }

    if (user.role !== 'SUPER_ADMIN' && module.course.batch.institute.ownerId !== user.id) {
      throw new UnauthorizedException('You do not have permission to modify this course curriculum');
    }

    return await this.prisma.lesson.create({
      data: {
        ...data,
        moduleId,
      },
    });
  }

  async findAll(user: any, moduleId?: string) {
    const where: any = {};
    if (moduleId) {
      where.moduleId = moduleId;
    }
    
    return this.prisma.lesson.findMany({
      where,
      orderBy: { order: 'asc' },
      include: { attachments: true }
    });
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        attachments: true,
        module: { include: { course: { include: { batch: { include: { institute: true } } } } } }
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto, user: any) {
    const lesson = await this.findOne(id);

    if (user.role !== 'SUPER_ADMIN' && lesson.module.course.batch.institute.ownerId !== user.id) {
      throw new UnauthorizedException('You do not have permission to modify this lesson');
    }

    return await this.prisma.lesson.update({
      where: { id },
      data: updateLessonDto,
    });
  }

  async remove(id: string, user: any) {
    const lesson = await this.findOne(id);

    if (user.role !== 'SUPER_ADMIN' && lesson.module.course.batch.institute.ownerId !== user.id) {
      throw new UnauthorizedException('You do not have permission to delete this lesson');
    }

    return await this.prisma.lesson.delete({
      where: { id },
    });
  }

  // Progress tracking
  async markProgress(id: string, user: any, completed: boolean, timestampSeconds?: number, watchedPercentage?: number) {
    return await this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: id,
        }
      },
      update: {
        completed,
        timestampSeconds,
        watchedPercentage,
      },
      create: {
        userId: user.id,
        lessonId: id,
        completed,
        timestampSeconds,
        watchedPercentage,
      }
    });
  }
}
