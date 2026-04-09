import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Ref } from '../../db/models/Ref';
import { RefRepository } from '../../db/models';

interface RefInput {
  type: string;
  target_id: string;
  version?: number;
}

@Injectable()
export class RefService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Ref) private readonly refRepo: RefRepository,
  ) {}

  @Transactional()
  async addRefs(ownerType: string, ownerId: string, refs: RefInput[]): Promise<Ref[]> {
    const entities = refs.map((r) => {
      const ref = new Ref();
      ref.ownerType = ownerType;
      ref.ownerId = ownerId;
      ref.type = r.type;
      ref.targetId = r.target_id;
      if (r.version !== undefined) ref.version = r.version;
      return ref;
    });
    entities.forEach((e) => this.em.persist(e));
    return entities;
  }

  async findByOwner(ownerType: string, ownerId: string): Promise<Ref[]> {
    return this.refRepo.find({ ownerType, ownerId });
  }

  async findByTarget(type: string, targetId: string): Promise<Ref[]> {
    return this.refRepo.find({ type, targetId });
  }

  async findOneByTarget(ownerType: string, type: string, targetId: string): Promise<Ref | null> {
    return this.refRepo.findOne({ ownerType, type, targetId });
  }

  async exists(ownerType: string, ownerId: string, type: string, targetId: string): Promise<boolean> {
    const count = await this.refRepo.count({ ownerType, ownerId, type, targetId });
    return count > 0;
  }
}
