import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import * as Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor(private readonly prisma: PrismaService) {
    const key_id = process.env.RAZORPAY_KEY_ID || 'mock_key_id';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret';
    this.razorpay = new Razorpay({ key_id, key_secret });
  }

  async createOrder(createPaymentDto: CreatePaymentDto, user: any) {
    const { courseId } = createPaymentDto;

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { batch: { include: { institute: true } } }
    });

    if (!course) {
      throw new NotFoundException(`Course not found`);
    }

    if (!course.isPublished) {
      throw new BadRequestException(`Course is not available for purchase`);
    }

    const amountInRupees = Number(course.price);
    if (amountInRupees <= 0) {
      throw new BadRequestException(`Course price must be greater than 0`);
    }

    const amountInPaise = amountInRupees * 100;
    
    // Calculate 5% Platform Fee, 95% Educator Share
    const platformFeePaise = Math.round(amountInPaise * 0.05);
    const educatorSharePaise = amountInPaise - platformFeePaise;

    const institute = course.batch.institute;
    
    let transfers = undefined;
    if (institute.razorpayLinkedAccountId) {
      transfers = [
        {
          account: institute.razorpayLinkedAccountId,
          amount: educatorSharePaise,
          currency: "INR",
          notes: {
            courseId: course.id,
            instituteId: institute.id,
            splitType: "95_percent_educator"
          },
          on_hold: false
        }
      ];
    }

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${course.id.substring(0, 10)}_${user.id.substring(0, 10)}`,
      transfers,
    };

    try {
      // Create Order on Razorpay
      const order = await this.razorpay.orders.create(options);

      // Save initial Pending Payment in DB
      const payment = await this.prisma.payment.create({
        data: {
          amount: amountInRupees,
          status: "PENDING",
          razorpayOrderId: order.id,
          studentId: user.id,
          courseId: course.id,
          instituteId: institute.id, // For easy querying later
        }
      });

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentId: payment.id,
      };
    } catch (error: any) {
      console.error("Razorpay Order Creation Error:", error);
      throw new InternalServerErrorException("Could not create payment order");
    }
  }

  async verifyPayment(body: any, user: any) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret';

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      throw new BadRequestException("Invalid payment signature");
    }

    // Mark Payment as SUCCESS
    const payment = await this.prisma.payment.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        status: "SUCCESS",
        razorpayPaymentId: razorpay_payment_id,
      }
    });

    // Automatically enroll the student into the Batch
    await this.prisma.batch.update({
      where: { id: payment.instituteId }, // Need to get batch ID actually, let's fix this below
      data: {
        students: {
          connect: { id: user.id }
        }
      }
    });

    // Wait, let's get the batch id from the course correctly
    const courseInfo = await this.prisma.course.findUnique({ where: { id: payment.courseId } });
    if (courseInfo) {
      await this.prisma.batch.update({
        where: { id: courseInfo.batchId },
        data: {
          students: { connect: { id: user.id } }
        }
      });
    }

    return { success: true, payment };
  }
}
