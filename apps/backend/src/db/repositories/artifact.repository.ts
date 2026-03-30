import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { Artifact } from '../models/Artifact';

export class ArtifactRepository extends SqlEntityRepository<Artifact> {
  persistArtifact(artifact: Artifact): void {
    this.getEntityManager().persist(artifact);
  }
}
