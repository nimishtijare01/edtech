import { AttachmentType } from '@repo/database';

export class CreateAttachmentDto {
  title: string;
  url: string;
  type: AttachmentType;
  lessonId: string;
  cfUploadId?: string;
  cfVideoId?: string;
}
