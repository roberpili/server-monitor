import { Column, PrimaryColumn } from 'typeorm';

export class User {
  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: String;

  @Column()
  name: String;

  @Column()
  email: String;
}
