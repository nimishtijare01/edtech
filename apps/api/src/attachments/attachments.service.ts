import { Injectable, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Injectable()
export class AttachmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDirectUpload(lessonId: string, user: any) {
    // Verify lesson ownership
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: { include: { batch: { include: { institute: true } } } } } } }
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson not found`);
    }

    if (user.role !== 'SUPER_ADMIN' && lesson.module.course.batch.institute.ownerId !== user.id) {
      throw new UnauthorizedException('You do not have permission to modify this lesson');
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
      // Mocked fallback for local dev if not configured
      console.warn("Cloudflare tokens not found, returning mock upload URL");
      return {
        uploadUrl: "mock_upload_url",
        uploadId: "mock_upload_id",
      };
    }

    try {
      const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxDurationSeconds: 3600 * 4, // Allow up to 4 hours per video
          requireSignedURLs: false,
          allowedOrigins: ["*"] // Lock this down to domain in production
        }),
      });

      if (!response.ok) {
        throw new Error(`Cloudflare API Error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        uploadUrl: data.result.uploadURL,
        uploadId: data.result.uid,
      };
    } catch (error: any) {
      console.error("Cloudflare upload error:", error);
      throw new InternalServerErrorException("Failed to generate video upload URL");
    }
  }

  async create(createAttachmentDto: CreateAttachmentDto, user: any) {
    const { lessonId, ...data } = createAttachmentDto;

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: { include: { batch: { include: { institute: true } } } } } } }
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
    }

    if (user.role !== 'SUPER_ADMIN' && lesson.module.course.batch.institute.ownerId !== user.id) {
      throw new UnauthorizedException('You do not have permission to modify this lesson');
    }

    return await this.prisma.attachment.create({
      data: {
        ...data,
        lessonId,
      },
    });
  }

  async findAll(user: any, lessonId?: string) {
    const where: any = {};
    if (lessonId) {
      where.lessonId = lessonId;
    }
    
    return this.prisma.attachment.findMany({ where });
  }

  async findOne(id: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
      include: { lesson: { include: { module: { include: { course: { include: { batch: { include: { institute: true } } } } } } } } }
    });

    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }
    return attachment;
  }

  async remove(id: string, user: any) {
    const attachment = await this.findOne(id);

    if (user.role !== 'SUPER_ADMIN' && attachment.lesson.module.course.batch.institute.ownerId !== user.id) {
      throw new UnauthorizedException('You do not have permission to delete this attachment');
    }

    if (attachment.type === 'VIDEO' && attachment.cfVideoId) {
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
      const apiToken = process.env.CLOUDFLARE_API_TOKEN;
      if (accountId && apiToken) {
        try {
          await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${attachment.cfVideoId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${apiToken}`,
            }
          });
        } catch (e) {
          console.error("Failed to delete cloudflare asset:", e);
        }
      }
    }

    return await this.prisma.attachment.delete({
      where: { id },
    });
  }
}
