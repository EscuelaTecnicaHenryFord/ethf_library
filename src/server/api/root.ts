import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  getBooks: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.book.findMany();
  }),
  addBook: protectedProcedure.input(z.object({
    code: z.number(),
    title: z.string(),
    author: z.string(),
    genre: z.string(),
    editor: z.string(),
  })).mutation(({ ctx, input }) => {
    return ctx.prisma.book.create({
      data: {
        code: input.code,
        title: input.title,
        author: input.author,
        genre: input.genre,
        editor: input.editor,
      }
    })
  }),
  updateBook: protectedProcedure.input(z.object({
    id: z.string(),
    code: z.number(),
    title: z.string(),
    author: z.string(),
    genre: z.string(),
    editor: z.string(),
  })).mutation(({ ctx, input }) => {
    return ctx.prisma.book.update({
      where: {
        id: input.id
      },
      data: {
        code: input.code,
        title: input.title,
        author: input.author,
        genre: input.genre,
        editor: input.editor,
      }
    })
  }),
  deleteBook: protectedProcedure.input(z.object({
    id: z.string(),
  })).mutation(({ ctx, input }) => {
    return ctx.prisma.book.delete({
      where: {
        id: input.id
      }
    })
  })
});

// export type definition of API
export type AppRouter = typeof appRouter;
