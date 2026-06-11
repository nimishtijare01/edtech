import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { SupabaseAuthGuard } from '../auth/supabase.guard';

@Controller('batches')
@UseGuards(SupabaseAuthGuard)
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Post()
  create(@Body() createBatchDto: CreateBatchDto, @Req() req: any) {
    return this.batchesService.create(createBatchDto, req.user);
  }

  @Get()
  findAll(@Req() req: any, @Query('instituteId') instituteId?: string) {
    return this.batchesService.findAll(req.user, instituteId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.batchesService.findOne(id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBatchDto: UpdateBatchDto, @Req() req: any) {
    return this.batchesService.update(id, updateBatchDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.batchesService.remove(id, req.user);
  }
}
