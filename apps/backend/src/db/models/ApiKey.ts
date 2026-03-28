import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class ApiKey {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ unique: true })
  keyHash!: string;

  @Property()
  name!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ nullable: true })
  lastUsedAt?: Date;

  @Property({ nullable: true })
  revokedAt?: Date;

  constructor(keyHash: string, name: string) {
    this.keyHash = keyHash;
    this.name = name;
  }
}
