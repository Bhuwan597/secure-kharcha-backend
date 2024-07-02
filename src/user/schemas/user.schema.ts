import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  displayName: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  eSewa: string;

  @Prop()
  photo: string;

  @Prop({ required: true })
  provider: string;

  @Prop({ default: false })
  emailVerified: boolean;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
