import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import {Report}  from  '../reports/reports.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({default : true})
   admin : boolean;

  @OneToMany(()=> Report , (report)=> report.user)
  reports: Report[]

  @AfterInsert()
  logInsertId() {
    console.log(`Inserted user with id : ${this.id}`);
  }

  @AfterUpdate()
  logUpateId() {
    console.log(`Updated  user with id : ${this.id}`);
  }

  @AfterRemove()
  logRemoveId() {
    console.log(`Removed  user with id : ${this.id}`);
  }
}
