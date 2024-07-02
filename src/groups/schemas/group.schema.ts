import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({
    timestamps: true,
})
export class Group extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    owner: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
    members: string[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }] })
    transactions: string[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }] })
    activities: string[];

    @Prop()
    token: string;
}

const GroupSchema = SchemaFactory.createForClass(Group);

export { GroupSchema };
