import { AttachmentType } from '@prisma/client';

export class CreateAttachmentDto {
  title: string;
  url: string;
  type: AttachmentType;
  lessonId: string;
  cfUploadId?: string;
  cfVideoId?: string;
}
