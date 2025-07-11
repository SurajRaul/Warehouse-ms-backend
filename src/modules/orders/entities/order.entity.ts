import { User } from 'src/modules/users/entities/user.entity';
import { JoinColumn, ManyToOne } from 'typeorm';

export class Order {
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;
}
