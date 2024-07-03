import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('transactions')
export class TransactionsController {
    constructor (private transactionsService: TransactionsService){}

    @Post()
    @UseGuards(AuthGuard)
    async createTransaction(@Req() req: Request , @Body() transactionData: CreateTransactionDto){
        return await this.transactionsService.createTransaction(req, transactionData);
    }
}
