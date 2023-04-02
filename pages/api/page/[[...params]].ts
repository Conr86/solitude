import prisma from "@/helpers/prisma";
import type { Page } from "@prisma/client";

import { Body, createHandler, Delete, Get, HttpCode, Param, Post } from 'next-api-decorators';

class PageHandler {
  // GET /api/users (read many)
  @Get()
  async listUsers() {
    return await prisma.page.findMany()
  }

  // GET /api/page/:id
  @Get('/:id')
  async fetchUser(@Param('id') id: string) {
    // Get data from your database
    const page = await prisma.page.findUnique({
      where: { id: parseInt(id) },
    });
    return page;
  }

  // POST /api/page/:id
  @Post('/:id')
  @HttpCode(201)
  async createUser(@Param('id') id: string, @Body() body: Page) {
    // Update or create data in your database
    const page = await prisma.page.upsert({
      where: { id: parseInt(id) },
      update: {
        title: body.title,
        content: body.content
      },
      create: {
        title: body.title,
        content: body.content
      }
    });
    return page;
  }

  // DELETE /api/page/:id
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    const page = await prisma.page.delete({
      where: { id: parseInt(id) },
    });
    return page;
  }
}

export default createHandler(PageHandler);