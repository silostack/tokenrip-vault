import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { Auth, AuthAgent } from '../auth/auth.decorator';
import { ContactService } from '../service/contact.service';
import { AgentService } from '../service/agent.service';

@Controller('v0/contacts')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly agentService: AgentService,
  ) {}

  @Auth('agent')
  @Get()
  async list(@AuthAgent() agent: { id: string }) {
    const contacts = await this.contactService.list(agent.id);
    const aliasMap = await this.contactService.buildAliasMap(contacts);
    return {
      ok: true,
      data: contacts.map((c) => this.contactService.serialize(c, aliasMap.get(c.contactAgentId) ?? null)),
    };
  }

  @Auth('agent')
  @Post()
  async add(
    @AuthAgent() agent: { id: string },
    @Body() body: { agentId: string; label?: string; notes?: string },
  ) {
    const resolvedId = await this.agentService.resolveByIdOrAlias(body.agentId);
    const contact = await this.contactService.add(agent.id, resolvedId, {
      label: body.label,
      notes: body.notes,
    });
    const contactAgent = await this.agentService.findById(contact.contactAgentId);
    return {
      ok: true,
      data: this.contactService.serialize(contact, contactAgent.alias ?? null),
    };
  }

  @Auth('agent')
  @Patch(':id')
  async update(
    @AuthAgent() agent: { id: string },
    @Param('id') id: string,
    @Body() body: { label?: string; notes?: string },
  ) {
    const contact = await this.contactService.update(id, agent.id, {
      label: body.label,
      notes: body.notes,
    });
    const contactAgent = await this.agentService.findById(contact.contactAgentId);
    return {
      ok: true,
      data: this.contactService.serialize(contact, contactAgent.alias ?? null),
    };
  }

  @Auth('agent')
  @Delete(':id')
  @HttpCode(204)
  async remove(
    @AuthAgent() agent: { id: string },
    @Param('id') id: string,
  ) {
    await this.contactService.removeById(id, agent.id);
  }
}
