import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createTransaction(
    @Req() req: Request,
    @Body() transactionData: CreateTransactionDto,
  ) {
    return await this.transactionsService.createTransaction(
      req,
      transactionData,
    );
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  async updateTransaction(
    @Param('slug') transactionId: string,
    @Req() req: Request,
    @Body() updatedData: UpdateTransactionDto,
  ) {
    return await this.transactionsService.updateTransaction(
      req,
      updatedData,
      transactionId,
    );
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteTransaction(
    @Param('slug') transactionId: string,
    @Req() req: Request,
  ) {
    return await this.transactionsService.deleteTransaction(transactionId, req);
  }
}
