import { Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';
import mongoose from 'mongoose';
import { Request } from 'express';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { Group } from 'src/groups/schemas/group.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: mongoose.Model<Transaction>,
    @InjectModel(Group.name)
    private groupModel: mongoose.Model<Group>,
  ) {}

  async createTransaction(
    @Req() req: Request,
    transactionData: CreateTransactionDto,
  ) {
    const transaction = await this.transactionModel.create({
      ...transactionData,
      transactionBy: req.user._id,
    });

    await this.groupModel.findByIdAndUpdate(
      transactionData.group,
      {
        $push: {
          transactions: transaction._id,
        },
      },{
        new : true
      }
    );

    return await this.transactionModel.findById(transaction._id);
  }
}
