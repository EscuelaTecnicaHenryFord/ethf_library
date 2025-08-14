import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { ethf } from "../db";
import { transporter } from "../email";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  getBooks: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.book.findMany();
  }),
  addBook: protectedProcedure.input(z.object({
    code: z.number(),
    title: z.string(),
    author: z.string(),
    genre: z.string(),
    editor: z.string(),
    location: z.string(),
    reference: z.string(),
    currentlyWith: z.string().optional(),
    status: z.enum(['active', 'inactive', 'lost', 'damaged'])
  })).mutation(async ({ ctx, input }) => {
    const isAdmin = env.ADMINS.has(ctx.session.user.email || '')

    if (!isAdmin) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    try {
      return await ctx.prisma.book.create({
        data: {
          code: input.code,
          title: input.title,
          author: input.author,
          genre: input.genre,
          editor: input.editor,
          location: input.location,
          reference: input.reference,
          currentlyWith: input.currentlyWith,
          status: input.status,
        }
      })
    } catch (error) {
      catchPrismaConstrainError(error as { code?: string });
    }
  }),
  updateBook: protectedProcedure.input(z.object({
    id: z.string(),
    code: z.number(),
    title: z.string(),
    author: z.string(),
    genre: z.string(),
    editor: z.string(),
    location: z.string(),
    reference: z.string(),
    currentlyWith: z.string().nullable().optional(),
    expectedReturn: z.date().nullable().optional(),
    status: z.enum(['active', 'inactive', 'lost', 'damaged'])
  })).mutation(async ({ ctx, input }) => {
    const isAdmin = env.ADMINS.has(ctx.session.user.email || '')

    if (!isAdmin) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    if (input.currentlyWith && !input.expectedReturn) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No se puede prestar un libro sin una fecha de devolución esperada.",
      });
    }

    try {
      const r = await ctx.prisma.book.update({
        where: {
          id: input.id
        },
        data: {
          code: input.code,
          title: input.title,
          author: input.author,
          genre: input.genre,
          editor: input.editor,
          location: input.location,
          reference: input.reference,
          currentlyWith: input.currentlyWith,
          expectedReturn: input.expectedReturn,
          status: input.status,
        }
      })
      


      if (input.currentlyWith !== undefined || input.expectedReturn !== undefined) {
        const studentReturn = r.currentlyWith ? await ethf.execute("SELECT * FROM estudiantes_ethf WHERE matricula = ?", [r.currentlyWith?.replace('HF', '')]) : undefined
        const student = studentReturn?.rows?.[0]

        await transporter.sendMail({
          to: ['biblioteca@henryford.edu.ar'],
          from: `${(process.env.SMTP_FROM_NAME || process.env.SMTP_USER || 'Reportes')} <${process.env.SMTP_FROM_EMAIL || ''}>`,
          subject: `Libro ${r.title} (${r.code}) prestado a ${r.currentlyWith}`,
          html: `<p>El libro <strong>${r.title}</strong> (${r.code}) ha sido prestado a <strong>${r.currentlyWith} ${student?.nombre} ${student?.apellido}</strong>.</p>
                   <p>Fecha de devolución esperada: ${r.expectedReturn ? r.expectedReturn.toLocaleDateString() : 'N/A'}.</p>`,
        }).catch(console.error);
      }

      return r
    } catch (error) {
      catchPrismaConstrainError(error as { code?: string });
    }
  }),
  deleteBook: protectedProcedure.input(z.object({
    id: z.string(),
  })).mutation(({ ctx, input }) => {
    const isAdmin = env.ADMINS.has(ctx.session.user.email || '')

    if (!isAdmin) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    return ctx.prisma.book.delete({
      where: {
        id: input.id
      }
    })
  }),
  getRole: protectedProcedure.query(({ ctx }) => {
    return {
      isAdmin: env.ADMINS.has(ctx.session.user.email || '')
    }
  }),
  listStudents: protectedProcedure.query(async ({ ctx }) => {
    const result = await ethf.execute("SELECT * FROM estudiantes_ethf")

    return result.rows.map(student => ({
      matricula: student.matricula,
      nombre: student.nombre,
      apellido: student.apellido,
      ingreso: student.ingreso,
      repite: student.repite,
    }) as { matricula: number, nombre: string, apellido: string, ingreso: number, repite: number })
  })
});

// export type definition of API
export type AppRouter = typeof appRouter;

function catchPrismaConstrainError(error: { code?: string }) {
  if (error.code === "P2002") {
    throw new TRPCError({
      code: "CONFLICT",
    });
  }
  throw error;
}