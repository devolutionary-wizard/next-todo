import { z } from 'zod';

const Todo = z.object({
    todo: z.string(),
    isCompleted: z.boolean().default(false),
});

export const TodoSchema = Todo.extend({
    id: z.string(),
});

export const UpdateTodoSchema = Todo.partial();