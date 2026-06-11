import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { InstitutesService } from './institutes.service';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';
import { SupabaseAuthGuard } from '../auth/supabase.guard';

@Controller('institutes')
@UseGuards(SupabaseAuthGuard)
export class InstitutesController {
  constructor(private readonly institutesService: InstitutesService) {}

  @Post()
  create(@Req() req: any, @Body() createInstituteDto: CreateInstituteDto) {
    // Force the ownerId to be the authenticated user's ID
    createInstituteDto.ownerId = req.user.id;
    return this.institutesService.create(createInstituteDto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.institutesService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.institutesService.findOne(id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInstituteDto: UpdateInstituteDto, @Req() req: any) {
    return this.institutesService.update(id, updateInstituteDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.institutesService.remove(id, req.user);
  }
}
