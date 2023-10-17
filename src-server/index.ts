import type { Page } from "@prisma/client";
import { Prisma, PrismaClient } from "@prisma/client";
import { NodeHtmlMarkdown, TranslatorConfigObject } from "node-html-markdown";
import fastify from "fastify";
import cors from "@fastify/cors";

const prisma = new PrismaClient();
const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};
const app = fastify({ logger: envToLogger.development ?? true });
app.register(cors);

// GET /api/page (list many)
app.get("/page", async () => {
  return prisma.page.findMany({
    select: {
      id: true,
      title: true,
      updatedAt: true,
      order: true,
      parentId: true,
      children: {
        select: {
          id: true,
          order: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
});

// GET /api/page/:id
app.get<{ Params: Prisma.PageSelect }>("/page/:id", async (req) => {
  const { id } = req.params;
  return prisma.page.findUnique({
    where: { id: Number(id) },
  });
});

// GET /api/page/:id/export to markdown
app.get<{ Params: Prisma.PageSelect }>("/page/:id/export", async (req, res) => {
  const { id } = req.params;
  const page = await prisma.page.findUnique({
    where: { id: Number(id) },
  });
  const header =
    `---\n` +
    `id: ${page?.id}\n` +
    `title: ${page?.title}\n` +
    `created: ${page?.createdAt.toISOString()}\n` +
    `updated: ${page?.updatedAt.toISOString()}\n` +
    `---\n\n`;
  const customTranslator: TranslatorConfigObject = {
    mention: ({ node }) => {
      const name = node.getAttribute("data-name");
      const url = node.getAttribute("data-url");
      if (!name || !url) return {};

      return {
        content: name,
        prefix: "[",
        postfix: "]" + `(/${url})`,
        recurse: false,
        preserveIfEmpty: true,
      };
    },
  };
  res.type("text/markdown");
  res.header(
    `Content-Disposition`,
    `attachment; filename=${page?.title + ".md" ?? "Export.md"}`,
  );
  res.send(
    header +
      NodeHtmlMarkdown.translate(page?.content ?? "", {}, customTranslator),
  );
});

// PUT /api/page/reorder (reorder a list of pages orders)
app.put<{ Body: Page[] }>(`/page/reorder`, async (req) => {
  const body = req.body;
  return await prisma.$transaction(
    body.map((page: Page) => {
      return prisma.page.update({
        where: { id: page.id },
        data: { order: page.order },
      });
    }),
  );
});

// PUT update page
app.put<{ Params: Prisma.PageSelect; Body: Prisma.PageUpdateInput }>(
  "/page/:id",
  async (req) => {
    const { id } = req.params;
    const body = req.body;

    // Only update updatedAt field if body or content changed
    if (body.content || body.title) body.updatedAt = new Date();
    // Update data in your database
    try {
      const page = await prisma.page.update({
        where: { id: Number(id) },
        data: body,
      });

      console.log(`${id} : ${body.title} updated`);

      return page;
    } catch (error) {
      app.log.error(error?.toString());
      return {
        error: `Page with ID ${id} might not exist in the database. Full error: ${error?.toString()}`,
      };
    }
  },
);

// POST create page
app.post<{ Body: Prisma.PageCreateInput }>(`/page`, async (req) => {
  const body = req.body;
  // Create data in your database
  return prisma.page.create({
    data: { ...body, updatedAt: new Date() },
  });
});

// DELETE delete page
app.delete<{ Params: Prisma.PageSelect }>(`/page/:id`, async (req) => {
  const { id } = req.params;
  return prisma.page.delete({
    where: {
      id: Number(id),
    },
  });
});

app.listen({ port: 3001 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server ready at: http://localhost:3001`);
});
