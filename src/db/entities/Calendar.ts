import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("calendars")
export class Calendar {
  @PrimaryGeneratedColumn({
    type: "int",
  })
  id: number;

  @Column({
    type: "date",
  })
  fulldate: Date;

  @Column({
    type: "tinyint",
  })
  day: number;

  @Column({
    type: "tinyint",
  })
  month: number;

  @Column({
    type: "tinyint",
  })
  quarter: number;

  @Column({
    type: "int",
  })
  year: number;
}
