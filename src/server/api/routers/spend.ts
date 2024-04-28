import { TRPCError } from "@trpc/server";
import { and, gte, lte, sql, sum } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { spend } from "@/server/db/schema";


export const spendRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        amount: z.number().or( z.string() ).pipe( z.coerce.number() ).optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(spend).values(input);
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.spend.findMany({
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
      const startMonth: Date = input.from
      
      const endMonth: Date = input.to

      const spends = await ctx.db.query.spend.findMany({
        where: and(gte(spend.createdAt, startMonth), lte(spend.createdAt, endMonth)),
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
      const startMonth: Date = input.from
      
      const endMonth: Date = input.to

      const total = await ctx.db
        .select({
          total: sql<number>`cast(sum(${spend.amount}) as float)`,
        })
        .from(spend)
        .where(
          and(gte(spend.createdAt, startMonth), lte(spend.createdAt, endMonth)),
        )

      return total[0]?.total ?? 0;
    }),
});
