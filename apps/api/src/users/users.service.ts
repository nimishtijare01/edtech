import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private supabaseAdmin: SupabaseClient;

  constructor(private readonly prisma: PrismaService) {
    this.supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    
    // For now, we mock the password hash for the Prisma schema
    const mockPasswordHash = Buffer.from(password).toString('base64');

    try {
      return await this.prisma.user.create({
        data: {
          ...rest,
          passwordHash: mockPasswordHash,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException(`A user with this ${error.meta?.target?.[0]} already exists`);
      }
      throw error;
    }
  }

  async invite(email: string, role: string, instituteId: string) {
    // 1. Invite via Supabase Auth
    const { data, error } = await this.supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { role, instituteId }
    });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    // 2. Create the user in our DB
    try {
      const user = await this.prisma.user.create({
        data: {
          id: data.user.id, // Keep IDs synced
          email,
          role,
          instituteId,
          passwordHash: 'invited', // Placeholder
        }
      });
      return user;
    } catch (dbError: any) {
      if (dbError.code === 'P2002') {
        throw new ConflictException('User already exists in the database');
      }
      throw dbError;
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        instituteId: true,
        createdAt: true,
      }
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        institute: true,
        createdAt: true,
      }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto as any;
    const dataToUpdate: any = { ...rest };
    
    if (password) {
      dataToUpdate.passwordHash = Buffer.from(password).toString('base64');
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: dataToUpdate,
        select: {
          id: true,
          email: true,
          role: true,
        }
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException(`A user with this ${error.meta?.target?.[0]} already exists`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }
}
