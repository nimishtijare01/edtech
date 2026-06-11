import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto, user: any) {
    const { batchId, ...data } = createCourseDto;

    // Verify batch exists
    const batch = await this.prisma.batch.findUnique({
      where: { id: batchId },
      include: { institute: true }
    });
    if (!batch) {
      throw new NotFoundException(`Batch with ID ${batchId} not found`);
    }

    if (user.role !== 'SUPER_ADMIN' && batch.institute.ownerId !== user.id) {
      throw new UnauthorizedException('You do not have permission to create courses for this batch');
    }

    return await this.prisma.course.create({
      data: {
        ...data,
        price: data.price ?? 0,
        batchId,
      },
    });
  }

  async findAll(user: any, batchId?: string) {
    const where: any = {};
    if (batchId) {
      where.batchId = batchId;
    }
    
    if (user.role !== 'SUPER_ADMIN') {
      where.batch = { institute: { ownerId: user.id } };
    }

    return this.prisma.course.findMany({ where });
  }

  async findOne(id: string, user: any) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { batch: { include: { institute: true } } },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    if (user.role !== 'SUPER_ADMIN' && course.batch.institute.ownerId !== user.id) {
      throw new UnauthorizedException('You do not have permission to access this course');
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto, user: any) {
    const course = await this.findOne(id, user); // Will throw if unauthorized

    try {
      return await this.prisma.course.update({
        where: { id },
        data: updateCourseDto,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string, user: any) {
    const course = await this.findOne(id, user); // Will throw if unauthorized
    try {
      return await this.prisma.course.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      throw error;
    }
  }
}
