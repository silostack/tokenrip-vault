import 'dotenv/config';
import { buildServer } from './server';

const port = parseInt(process.env.PORT || '3500', 10);

async function start() {
  const server = await buildServer();
  await server.listen({ port, host: '0.0.0.0' });
  console.log(`blog-engine listening on :${port}`);
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
