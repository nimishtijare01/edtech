import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { SupabaseAuthGuard } from '../auth/supabase.guard';

@Controller('attachments')
@UseGuards(SupabaseAuthGuard)
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post('cloudflare-upload')
  createCloudflareUpload(@Body('lessonId') lessonId: string, @Req() req: any) {
    return this.attachmentsService.createDirectUpload(lessonId, req.user);
  }

  @Post()
  create(@Body() createAttachmentDto: CreateAttachmentDto, @Req() req: any) {
    return this.attachmentsService.create(createAttachmentDto, req.user);
  }

  @Get()
  findAll(@Req() req: any, @Query('lessonId') lessonId?: string) {
    return this.attachmentsService.findAll(req.user, lessonId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attachmentsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.attachmentsService.remove(id, req.user);
  }
}
