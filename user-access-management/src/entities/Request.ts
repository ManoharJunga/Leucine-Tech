import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Software } from "./Software";

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true })
  user!: User;

  @ManyToOne(() => Software, { eager: true })
  software!: Software;

  @Column()
  accessType!: "Read" | "Write" | "Admin";

  @Column("text")
  reason!: string;

  @Column()
  status!: "Pending" | "Approved" | "Rejected";
}
