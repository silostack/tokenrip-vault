import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Agent } from '../../db/models/Agent';
import { User } from '../../db/models/User';
import { OperatorBinding } from '../../db/models/OperatorBinding';
import { OperatorBindingRepository } from '../../db/models';

@Injectable()
export class OperatorBindingService {
  constructor(
    @InjectRepository(OperatorBinding) private readonly bindingRepo: OperatorBindingRepository,
  ) {}

  async findBoundAgent(userId: string): Promise<Agent | null> {
    const binding = await this.bindingRepo.findOne({ user: { id: userId } }, { populate: ['agent'] });
    return binding?.agent ?? null;
  }

  async findBoundUser(agentId: string): Promise<User | null> {
    const binding = await this.bindingRepo.findOne({ agent: { id: agentId } }, { populate: ['user'] });
    return binding?.user ?? null;
  }
}
