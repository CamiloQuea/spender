// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  real,
  primaryKey,
  foreignKey,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `spender_${name}`);

export const transactionType = createTable(
  "transaction_type",
  {
    id: serial("id").primaryKey(),
    name: varchar("name"),
    description: varchar("description"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (table) => ({
    nameIndex: index("transactionT_name_idx").on(table.name),
  }),
);

export const transactionAvailableOptions = createTable(
  "transaction_available_options",
  {
    id: serial("id"),
    transactionTypeId: serial("transaction_type_id")
      .references(() => transactionType.id)
      .notNull(),
    name: varchar("name"),
    description: varchar("description"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (table) => ({
    nameIndex: index("transactionAO_name_idx").on(table.name),
    pk: primaryKey({
      columns: [table.transactionTypeId, table.id],
    }),
  }),
);

export const transaction = createTable(
  "transaction",
  {
    id: serial("id").primaryKey(),
    transactionTypeId: serial("transaction_type_id")
      .references(() => transactionType.id)
      .notNull(),
    amount: real("amount").default(0).notNull(),
    name: varchar("name"),
    description: varchar("description"),

    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (table) => ({
    nameIndex: index("transaction_name_idx").on(table.name),
  }),
);

export const transactionOptions = createTable(
  "transaction_options",
  {
    id: serial("id"),
    transactionId: serial("transaction_id").notNull(),
    transactionTypeId: serial("transaction_type_id").notNull(),
    transactionOptionsId: serial("transaction_options_id").notNull(),
    value: varchar("value"),
    description: varchar("description"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (table) => ({
    valueIndex: index("transactionO_value_idx").on(table.value),
    pk: primaryKey({
      columns: [table.transactionTypeId, table.id],
    }),
    availTransactionOpts: foreignKey({
      columns: [table.transactionOptionsId, table.transactionTypeId],
      foreignColumns: [
        transactionAvailableOptions.id,
        transactionAvailableOptions.transactionTypeId,
      ],
      name: "transactionAvailableOptions_fk",
    }),
    transactionFk: foreignKey({
      columns: [table.transactionId, table.transactionTypeId],
      foreignColumns: [transaction.id, transaction.transactionTypeId],
      name: "transaction_fk",
    }),
  }),
);

export type Transaction = typeof transaction.$inferSelect;
export type NewTransaction = typeof transaction.$inferInsert;
export type TransactionOption = typeof transactionOptions.$inferSelect;
export type NewTransactionOption = typeof transactionOptions.$inferInsert;
export type TransactionType = typeof transactionType.$inferSelect;
export type NewTransactionType = typeof transactionType.$inferInsert;
export type TransactionAvailableOptions =
  typeof transactionAvailableOptions.$inferSelect;
export type NewTransactionAvailableOptions =
  typeof transactionAvailableOptions.$inferInsert;
