import { boolean, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const todos = mysqlTable("todos", {
    id: varchar('id', { length: 255 }),
    todo: text('todo').notNull(),
    isCompleted: boolean('isCompleted').notNull().default(false),
    createdAt: timestamp("createdAt", { mode: "string", fsp: 0 })
        .notNull()
        .defaultNow(),
});