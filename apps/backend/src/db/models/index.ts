import { Artifact } from './Artifact';
import { ApiKey } from './ApiKey';

export { Artifact, ArtifactType } from './Artifact';
export { ApiKey } from './ApiKey';
export { ArtifactRepository } from '../repositories/artifact.repository';

export const entities = [Artifact, ApiKey];
