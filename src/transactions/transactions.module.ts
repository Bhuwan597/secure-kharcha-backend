import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { GroupsModule } from 'src/groups/groups.module';
import { Group, GroupSchema } from 'src/groups/schemas/group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Transaction.name, schema: TransactionSchema}]),
    MongooseModule.forFeature([{name: Group.name, schema: GroupSchema}]),
    AuthModule,
    UserModule,
    GroupsModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule {}
