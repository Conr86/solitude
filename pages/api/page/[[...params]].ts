import prisma from "@/helpers/prisma";
import type { Page } from "@prisma/client";

import { Body, createHandler, Delete, Get, HttpCode, Param, Put, Post } from 'next-api-decorators';

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

  // PUT /api/pages/ (update many)
  @Put()
  @HttpCode(201)
  async updateManyPages(@Param('id') id: string, @Body() body: any) {
    let { whereQ, dataQ } = body;

    // Update multiple pages in your database
    const page = await prisma.page.updateMany({
      where: whereQ,
      data: dataQ,
    });
    return page;
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