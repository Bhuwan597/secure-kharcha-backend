import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop()
  title: string;

  @Prop()
  amount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  transactionBy: Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  exclude: Types.ObjectId[];

  @Prop({ default: true })
  split: boolean;
}

const TransactionSchema = SchemaFactory.createForClass(Transaction);

export { TransactionSchema };
