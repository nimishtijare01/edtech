import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { SupabaseAuthGuard } from '../auth/supabase.guard';

@Controller('payments')
@UseGuards(SupabaseAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  createOrder(@Body() createPaymentDto: CreatePaymentDto, @Req() req: any) {
    return this.paymentsService.createOrder(createPaymentDto, req.user);
  }

  @Post('verify')
  verifyPayment(@Body() body: any, @Req() req: any) {
    return this.paymentsService.verifyPayment(body, req.user);
  }
}
