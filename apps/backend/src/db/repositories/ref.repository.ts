import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { Ref } from '../models/Ref';

export class RefRepository extends SqlEntityRepository<Ref> {
  async findMessageIdsForThread(threadId: string): Promise<string[]> {
    const rows = await this.getEntityManager().getConnection().execute(
      'SELECT id FROM message WHERE thread_id = ?',
      [threadId],
    );
    return rows.map((r: { id: string }) => r.id);
  }
}
