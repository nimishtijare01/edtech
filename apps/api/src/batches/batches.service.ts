import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';

@Injectable()
export class BatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBatchDto: CreateBatchDto, user: any) {
    const { instituteId, ...data } = createBatchDto;

    // Verify institute exists and user owns it
    const institute = await this.prisma.institute.findUnique({
      where: { id: instituteId },
    });
    if (!institute) {
      throw new NotFoundException(`Institute with ID ${instituteId} not found`);
    }

    if (user.role !== 'SUPER_ADMIN' && institute.ownerId !== user.id) {
      throw new UnauthorizedException('You do not have permission to create batches for this institute');
    }

    return await this.prisma.batch.create({
      data: {
        ...data,
        instituteId,
      },
    });
  }

  async findAll(user: any, instituteId?: string) {
    const where: any = {};
    if (instituteId) {
      where.instituteId = instituteId;
    }
    
    if (user.role !== 'SUPER_ADMIN') {
      where.institute = { ownerId: user.id };
    }

    return this.prisma.batch.findMany({
      where,
      include: { courses: true, institute: true }
    });
  }

  async findOne(id: string, user: any) {
    const batch = await this.prisma.batch.findUnique({
      where: { id },
      include: { courses: true, institute: true },
    });
    if (!batch) {
      throw new NotFoundException(`Batch with ID ${id} not found`);
    }

    if (user.role !== 'SUPER_ADMIN' && batch.institute.ownerId !== user.id) {
      throw new UnauthorizedException('You do not have permission to access this batch');
    }

    return batch;
  }

  async update(id: string, updateBatchDto: UpdateBatchDto, user: any) {
    const batch = await this.findOne(id, user); // Will throw if unauthorized

    try {
      return await this.prisma.batch.update({
        where: { id },
        data: updateBatchDto,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Batch with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string, user: any) {
    const batch = await this.findOne(id, user); // Will throw if unauthorized
    try {
      return await this.prisma.batch.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Batch with ID ${id} not found`);
      }
      throw error;
    }
  }
}
