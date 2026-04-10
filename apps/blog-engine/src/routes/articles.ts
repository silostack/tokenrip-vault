import { FastifyInstance } from 'fastify';
import { ArticleService } from '../services/article.service';
import { enrichArticle } from '../services/publish.service';

export async function articleRoutes(
  fastify: FastifyInstance,
  opts: { articleService: ArticleService },
) {
  const { articleService } = opts;

  // Static routes must come before parameterized routes
  fastify.get('/articles/tags', async () => {
    const tags = await articleService.tags();
    return { tags };
  });

  fastify.get<{ Querystring: { limit?: string; offset?: string } }>(
    '/articles',
    async (request) => {
      const limit = parseInt(request.query.limit || '20', 10);
      const offset = parseInt(request.query.offset || '0', 10);
      const articles = await articleService.list({ limit, offset });
      return { articles };
    },
  );

  fastify.get<{ Params: { slug: string } }>(
    '/articles/:slug',
    async (request, reply) => {
      const { slug } = request.params;
      const article = await articleService.getBySlug(slug);
      if (!article) {
        return reply.status(404).send({ error: 'Article not found' });
      }
      return {
        frontmatter: article.frontmatter,
        content: article.content,
      };
    },
  );

  fastify.post('/articles/publish', async (request, reply) => {
    const body = request.body as string;
    if (!body) {
      return reply
        .status(400)
        .send({ error: 'Request body is required' });
    }

    try {
      const enriched = enrichArticle(body);
      const slug = await articleService.store(enriched.output, {
        frontmatter: enriched.frontmatter,
      });
      return { ok: true, slug };
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/articles/reindex', async () => {
    const count = await articleService.reindex();
    return { ok: true, count };
  });

  fastify.delete<{ Params: { slug: string } }>(
    '/articles/:slug',
    async (request) => {
      const { slug } = request.params;
      await articleService.deleteBySlug(slug);
      return { ok: true };
    },
  );
}
