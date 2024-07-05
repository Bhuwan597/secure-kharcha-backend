import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

@Schema({timestamps: true})
class GroupMember extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
    user: Types.ObjectId;
}
const GroupMemberSchema = SchemaFactory.createForClass(GroupMember);


@Schema({
    timestamps: true,
})
export class Group extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop()
    photo: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    owner: Types.ObjectId;

    @Prop({ type: [GroupMemberSchema], default: [] })
    members: {
        user: Types.ObjectId;
    }[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }] })
    transactions: Types.ObjectId[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }] })
    activities: string[];

    @Prop()
    token: string;
}

const GroupSchema = SchemaFactory.createForClass(Group);

export { GroupSchema };
