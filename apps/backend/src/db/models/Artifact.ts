import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { ArtifactRepository } from '../repositories/artifact.repository';

export enum ArtifactType {
  FILE = 'file',
  MARKDOWN = 'markdown',
  HTML = 'html',
  CHART = 'chart',
}

@Entity({ repository: () => ArtifactRepository })
export class Artifact {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ nullable: true })
  title?: string;

  @Property({ nullable: true, type: 'text' })
  description?: string;

  @Enum(() => ArtifactType)
  type: ArtifactType;

  @Property({ nullable: true })
  mimeType?: string;

  @Property()
  storageKey: string;

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, unknown>;

  @Property()
  apiKeyId: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(type: ArtifactType, storageKey: string, apiKeyId: string) {
    this.type = type;
    this.storageKey = storageKey;
    this.apiKeyId = apiKeyId;
  }
}
