import { TRPCError } from "@trpc/server";
import { and, gte, lte, sql, sum } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { transaction } from "@/server/db/schema";
import { transactionTypeRouter } from "./type";

export const transactionRouter = createTRPCRouter({
  type: transactionTypeRouter,
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        amount: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(transaction).values(input);
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.transaction.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),
  getAllByRange: publicProcedure
    .input(
      z.object({
        from: z.date(),
        to: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const startMonth: Date = input.from;

      const endMonth: Date = input.to;

      const spends = await ctx.db.query.transaction.findMany({
        where: and(
          gte(transaction.createdAt, startMonth),
          lte(transaction.createdAt, endMonth),
        ),
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      });

      return spends;
    }),

  getTotalByRange: publicProcedure
    .input(
      z.object({
        from: z.date(),
        to: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const startMonth: Date = input.from;

      const endMonth: Date = input.to;

      const total = await ctx.db
        .select({
          total: sql<number>`cast(sum(${transaction.amount}) as float)`,
        })
        .from(transaction)
        .where(
          and(
            gte(transaction.createdAt, startMonth),
            lte(transaction.createdAt, endMonth),
          ),
        );

      return total[0]?.total ?? 0;
    }),
});
