import prisma from "@/helpers/prisma";
import type { Page } from "@prisma/client";
import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions, TranslatorConfig, TranslatorConfigObject } from 'node-html-markdown';
import { Body, createHandler, Delete, Get, HttpCode, Param, Put, Post, Download } from 'next-api-decorators';

class PageHandler {
  // GET /api/pages (read many)
  @Get()
  async listPages() {
    //await new Promise(res => setTimeout(res, 1000));
    return await prisma.page.findMany({
      include: {
        children: {
          select: {
            id: true,
            order: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
  }

  // PUT /api/page/ (update many)
  // @Put()
  // @HttpCode(201)
  // async updateManyPages(@Body() body: any) {
  //   let { whereQ, dataQ } = body;

  //   // Update multiple pages in your database
  //   const page = await prisma.page.updateMany({
  //     where: whereQ,
  //     data: dataQ,
  //   });
  //   return page;
  // }

  // PUT /api/page/reorder (reorder a list of pages orders)
  @Put('/reorder')
  async bulkUpdateOrderPages(@Body() body: Page[]) {
    let result = await prisma.$transaction(
      body.map((page: Page) => {
        return prisma.page.update({
          where: { id: page.id },
          data: { order: page.order}
        })
      }
    ))
    return result;
  }

  // GET /api/page/:id
  @Get('/:id')
  async fetchPage(@Param('id') id: string) {
    // Get data from your database
    const page = await prisma.page.findUnique({
      where: { id: parseInt(id) },
    });
    return page;
  }

  // GET /api/page/:id/export to markdown
  @Get('/:id/export')
  @Download()
  async exportPage(@Param('id') id: string) {
    // Get data from your database
    const page = await prisma.page.findUnique({
      where: { id: parseInt(id) },
    });
    const header = `---\n` +
    `id: ${page?.id}\n` +
    `title: ${page?.title}\n` +
    `created: ${page?.createdAt.toISOString()}\n` +
    `updated: ${page?.updatedAt.toISOString()}\n` +
    `---\n\n`;
    const customTranslator: TranslatorConfigObject = {
      'mention': ({ node }) => {
        const name = node.getAttribute('data-name');
        const url = node.getAttribute('data-url');
        if (!name || !url) return {};

        return {
          content: name,
          prefix: '[',
          postfix: ']' + `(/${url})`,
          recurse: false,
          preserveIfEmpty: true,
        }
      },
    }
    return {
      filename: page?.title + ".md" ?? "Export.md",
      contents: header + NodeHtmlMarkdown.translate(page?.content ?? "", {}, customTranslator),
      contentType: 'text/markdown'
    }
  }

  // POST /api/page/
  @Post()
  @HttpCode(201)
  async createPage(@Body() body: Page) {
    // Create data in your database
    const page = await prisma.page.create({
      data: { ...body, updatedAt: new Date()},
    });
    return page;
  }

  // PUT /api/page/:id
  @Put('/:id')
  @HttpCode(201)
  async updatePage(@Param('id') id: string, @Body() body: Page) {
    // Only update updatedAt field if body or content changed
    if (body.content || body.title) body.updatedAt = new Date();
    // Update data in your database
    const page = await prisma.page.update({
      where: { id: parseInt(id) },
      data: body,
    });
    return page;
  }

  // DELETE /api/page/:id
  @Delete('/:id')
  async deletePage(@Param('id') id: string) {
    const page = await prisma.page.delete({
      where: { id: parseInt(id) },
    });
    return page;
  }
}

export default createHandler(PageHandler);