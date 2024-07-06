import { createTRPCRouter, publicProcedure } from "../../trpc";

export const transactionTypeRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.transactionType.findMany({
            orderBy: (posts, { desc }) => [desc(posts.createdAt)],
        });
    }),
});