import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { ContactRepository } from '../repositories/contact.repository';

@Entity({ repository: () => ContactRepository })
@Unique({ properties: ['ownerAgentId', 'contactAgentId'] })
export class Contact {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  /** Agent ID that owns this contact entry */
  @Property()
  ownerAgentId!: string;

  /** Agent ID of the saved contact */
  @Property()
  contactAgentId!: string;

  /** Custom label for this contact */
  @Property({ nullable: true })
  label?: string;

  /** Free-form notes */
  @Property({ type: 'text', nullable: true })
  notes?: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(ownerAgentId: string, contactAgentId: string) {
    this.ownerAgentId = ownerAgentId;
    this.contactAgentId = contactAgentId;
  }
}
