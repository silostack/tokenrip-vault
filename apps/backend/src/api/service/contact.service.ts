import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Contact } from '../../db/models/Contact';
import { ContactRepository } from '../../db/repositories/contact.repository';
import { AgentService } from './agent.service';

export interface ContactResponse {
  id: string;
  agentId: string;
  alias: string | null;
  label: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ContactService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Contact) private readonly repo: ContactRepository,
    private readonly agentService: AgentService,
  ) {}

  async list(ownerAgentId: string): Promise<Contact[]> {
    return this.repo.find(
      { ownerAgentId },
      { orderBy: { createdAt: 'DESC' } },
    );
  }

  /** Batch-load aliases for a list of contacts. */
  async buildAliasMap(contacts: Contact[]): Promise<Map<string, string | null>> {
    const ids = [...new Set(contacts.map((c) => c.contactAgentId))];
    const agents = await this.agentService.findByIds(ids);
    const map = new Map<string, string | null>();
    for (const a of agents) map.set(a.id, a.alias ?? null);
    return map;
  }

  /** Serialize a Contact + alias into a response DTO. */
  serialize(contact: Contact, alias: string | null): ContactResponse {
    return {
      id: contact.id,
      agentId: contact.contactAgentId,
      alias,
      label: contact.label ?? null,
      notes: contact.notes ?? null,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    };
  }

  @Transactional()
  async add(
    ownerAgentId: string,
    contactAgentId: string,
    opts?: { label?: string; notes?: string },
  ): Promise<Contact> {
    if (ownerAgentId === contactAgentId) {
      throw new BadRequestException({
        ok: false,
        error: 'CANNOT_ADD_SELF',
        message: 'Cannot add yourself as a contact',
      });
    }

    await this.agentService.findById(contactAgentId);

    const existing = await this.repo.findOne({ ownerAgentId, contactAgentId });
    if (existing) {
      if (opts?.label !== undefined) existing.label = opts.label;
      if (opts?.notes !== undefined) existing.notes = opts.notes;
      return existing;
    }

    const contact = new Contact(ownerAgentId, contactAgentId);
    if (opts?.label !== undefined) contact.label = opts.label;
    if (opts?.notes !== undefined) contact.notes = opts.notes;
    this.em.persist(contact);
    return contact;
  }

  @Transactional()
  async update(
    id: string,
    ownerAgentId: string,
    opts: { label?: string; notes?: string },
  ): Promise<Contact> {
    const contact = await this.repo.findOne({ id, ownerAgentId });
    if (!contact) {
      throw new NotFoundException({
        ok: false,
        error: 'CONTACT_NOT_FOUND',
        message: 'Contact not found',
      });
    }
    if (opts.label !== undefined) contact.label = opts.label;
    if (opts.notes !== undefined) contact.notes = opts.notes;
    return contact;
  }

  @Transactional()
  async removeById(id: string, ownerAgentId: string): Promise<void> {
    const contact = await this.repo.findOne({ id, ownerAgentId });
    if (!contact) {
      throw new NotFoundException({
        ok: false,
        error: 'CONTACT_NOT_FOUND',
        message: 'Contact not found',
      });
    }
    this.em.remove(contact);
  }

  @Transactional()
  async removeByAgentId(ownerAgentId: string, contactAgentId: string): Promise<void> {
    const contact = await this.repo.findOne({ ownerAgentId, contactAgentId });
    if (!contact) {
      throw new NotFoundException({
        ok: false,
        error: 'CONTACT_NOT_FOUND',
        message: 'Contact not found',
      });
    }
    this.em.remove(contact);
  }
}
