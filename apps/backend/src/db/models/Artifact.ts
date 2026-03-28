import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class Artifact {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ nullable: true })
  title?: string;

  @Property({ nullable: true, type: 'text' })
  description?: string;

  @Property()
  type!: 'file' | 'markdown' | 'html' | 'chart';

  @Property({ nullable: true })
  mimeType?: string;

  @Property()
  storageKey!: string;

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, unknown>;

  @Property()
  apiKeyId!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
