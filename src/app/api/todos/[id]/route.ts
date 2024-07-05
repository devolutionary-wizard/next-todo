import { db } from "@/drizzle/db";
import { todos } from "@/drizzle/schema";
import { UpdateTodoSchema } from "@/types/todo";
import { eq } from "drizzle-orm/mysql-core/expressions";

export function DELETE(req: Request, { params }: { params: { id: string } }) {
    return db.delete(todos)
        .where(eq(todos.id, params.id))
        .then(response => Response.json({ status: "success", message: "Todo deleted successfully" }))
        .catch(error => Response.json({ status: "error", message: (error as Error).message, }));
}

export function PUT(req: Request, { params }: { params: { id: string } }) {
    return req.json()
        .then(updatedTodoData => {
            const data = UpdateTodoSchema.parse(updatedTodoData);
            return db.update(todos).set(data)
                .where(eq(todos.id, params.id))
                .then(response => Response.json({ status: "success", data: response }));
        }).catch(error => new Response(JSON.stringify({ status: "error", message: (error as Error).message, })));
}

export function PATCH(req: Request, { params }: { params: { id: string } }) {
    return db.select()
        .from(todos)
        .where(eq(todos.id, params.id))
        .then(res => {
            const [todo] = res;
            return db.update(todos)
                .set({ isCompleted: !todo.isCompleted })
                .where(eq(todos.id, params.id))
                .then(() => Response.json({ status: "success", message: "Todo updated successfully" }))
                .catch(error => Response.json({ status: "error", message: (error as Error).message, }));
        }).catch(error => Response.json({ status: "error", message: (error as Error).message, }));
}