import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: String;

  @Column()
  name: String;

  @Column()
  email: String;
}
