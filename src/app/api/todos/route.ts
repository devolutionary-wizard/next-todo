import { db } from "@/drizzle/db";
import { todos } from "@/drizzle/schema";
import { TodoSchema } from "@/types/todo";
import { ZodError } from "zod";
import { randomUUID } from "crypto";

export function GET() {
    return db.select().from(todos)
        .then(res => Response.json({ status: "success", data: res }))
        .catch(err => Response.json({ status: "error", data: err.message }));
}


export function POST(req: Request) {
    return req.json()
        .then(body => {
            const data = TodoSchema.parse({ ...body, id: randomUUID() });
            return db.insert(todos).values(data)
                .then(() => Response.json({ status: "success", data: data }))
                .catch(error => Response.json({ status: "error", message: error.message }));
        }).catch(error => {
            if (error instanceof ZodError) return Response.json({ status: "error", data: error.issues })
            return Response.json({
                status: "error",
                message: error.message,
            });
        });
}