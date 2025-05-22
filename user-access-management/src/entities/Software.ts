// src/entities/Software.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Software {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "varchar" })
  accessLevel!: "Read" | "Write" | "Admin";
}
