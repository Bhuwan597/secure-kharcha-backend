import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true})
  group: Types.ObjectId

  @Prop({required: true})
  title: string;

  @Prop({required: true})
  amount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  transactionBy: Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  exclude: Types.ObjectId[];

  @Prop({ default: true })
  split: boolean;
}

const TransactionSchema = SchemaFactory.createForClass(Transaction);

export { TransactionSchema };
