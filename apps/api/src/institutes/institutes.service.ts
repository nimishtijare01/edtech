import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';

@Injectable()
export class InstitutesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInstituteDto: CreateInstituteDto) {
    try {
      return await this.prisma.institute.create({
        data: {
          name: createInstituteDto.name,
          subdomain: createInstituteDto.subdomain,
          tier: createInstituteDto.tier,
          ownerId: createInstituteDto.ownerId!,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException(`An institute with this ${error.meta?.target?.[0]} already exists`);
      }
      throw error;
    }
  }

  async findAll(user: any) {
    if (user.role === 'SUPER_ADMIN') {
      return this.prisma.institute.findMany();
    }
    return this.prisma.institute.findMany({
      where: { ownerId: user.id }
    });
  }

  async findOne(id: string, user: any) {
    const institute = await this.prisma.institute.findUnique({
      where: { id },
      include: {
        owner: true, // Join to get owner details
      },
    });

    if (!institute) {
      throw new NotFoundException(`Institute with ID ${id} not found`);
    }

    if (user.role !== 'SUPER_ADMIN' && institute.ownerId !== user.id) {
      throw new UnauthorizedException('You do not have permission to access this institute');
    }

    return institute;
  }

  async update(id: string, updateInstituteDto: UpdateInstituteDto, user: any) {
    const institute = await this.findOne(id, user); // Will throw if unauthorized

    try {
      return await this.prisma.institute.update({
        where: { id },
        data: updateInstituteDto,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException(`An institute with this ${error.meta?.target?.[0]} already exists`);
      }
      throw error;
    }
  }

  async remove(id: string, user: any) {
    const institute = await this.findOne(id, user); // Will throw if unauthorized
    
    return await this.prisma.institute.delete({
      where: { id },
    });
  }
}
