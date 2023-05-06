import prisma from "@/helpers/prisma";
import type { Page } from "@prisma/client";

import { Body, createHandler, Delete, Get, HttpCode, Param, Put, Post } from 'next-api-decorators';

class PageHandler {
  // GET /api/users (read many)
  @Get()
  async listUsers() {
    return await prisma.page.findMany({
      include: {
        children: {
          select: {
            id: true
          }
        }
      }
    })
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

  // POST /api/page/
  @Post()
  @HttpCode(201)
  async createUser(@Body() body: Page) {
    // Create data in your database
    const page = await prisma.page.create({
      data: body,
    });
    return page;
  }

  // PUT /api/page/:id
  @Put('/:id')
  @HttpCode(201)
  async updateUser(@Param('id') id: string, @Body() body: Page) {
    // Update data in your database
    const page = await prisma.page.update({
      where: { id: parseInt(id) },
      data: body,
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