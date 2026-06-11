import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { InstitutesModule } from './institutes/institutes.module';
import { BatchesModule } from './batches/batches.module';
import { CoursesModule } from './courses/courses.module';
import { CourseModulesModule } from './course-modules/course-modules.module';
import { LessonsModule } from './lessons/lessons.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { PaymentsModule } from './payments/payments.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [PrismaModule, UsersModule, InstitutesModule, BatchesModule, CoursesModule, CourseModulesModule, LessonsModule, AttachmentsModule, PaymentsModule, StudentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
