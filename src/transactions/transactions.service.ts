import { BadRequestException, Injectable, Req, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';
import mongoose, { Types } from 'mongoose';
import { Request } from 'express';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { Group } from 'src/groups/schemas/group.schema';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';

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
    const excludeIds =
      transactionData?.exclude?.map((id) => new Types.ObjectId(id)) || [];
    const transaction = await this.transactionModel.create({
      ...transactionData,
      exclude: excludeIds,
      transactionBy: req.user._id,
    });

    await this.groupModel.findByIdAndUpdate(
      transactionData.group,
      {
        $push: {
          transactions: transaction._id,
          activities: {
            displayName: req.user.displayName,
            content: `created the ${transaction.title} transaction`,
          },
        },
      },
      {
        new: true,
      },
    );

    return await this.transactionModel.findById(transaction._id);
  }

  async updateTransaction(
    req: Request,
    updatedData: UpdateTransactionDto,
    transactionId: string,
  ) {
    const transaction = await this.transactionModel.findById(transactionId);
    const group = await this.groupModel.findById(updatedData.group);
    if (!transaction) {
      throw new BadRequestException('No transaction found.');
    }
    if (
      transaction.transactionBy.equals(req.user._id as Types.ObjectId) ||
      group.owner.equals(req.user._id as Types.ObjectId)
    ) {
      const updatedTransaction = await this.transactionModel.findByIdAndUpdate(
        transactionId,
        updatedData,
        { new: true },
      );
      await this.groupModel.findByIdAndUpdate(updatedData.group, {
        $push: {
          activities: {
            displayName: req.user.displayName,
            content: `updated the ${transaction.title} transaction`,
          },
        },
      });
      return updatedTransaction;
    } else {
      throw new BadRequestException('You cannot edit this transaction.');
    }
  }
  async deleteTransaction(transactionId: string, req: Request) {
    const transaction = await this.transactionModel
      .findById(transactionId)
      .populate('transactionBy');
    const group = await this.groupModel
      .findById(transaction.group)
      .populate('owner');
    if (!transaction) {
      throw new BadRequestException('No transaction found.');
    }
    if (
      transaction.transactionBy.equals(req.user._id as Types.ObjectId) ||
      group.owner.equals(req.user._id as Types.ObjectId)
    ) {
      const deletedTransaction =
        this.transactionModel.findByIdAndDelete(transactionId);
      await this.groupModel.findByIdAndUpdate(transaction.group, {
        $push: {
          activities: {
            displayName: req.user.displayName,
            content: `deleted the ${transaction.title} transaction`,
          },
        },
      });
      return deletedTransaction;
    } else {
      throw new BadRequestException('You cannot edit this transaction.');
    }
  }
}
