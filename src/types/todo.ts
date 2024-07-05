import { z } from 'zod';

const Todo = z.object({
    todo: z.string().min(1,""),
    isCompleted: z.boolean().default(false),
});

export const TodoSchema = Todo.extend({
    id: z.string(),
});

export const UpdateTodoSchema = Todo.partial();