import { TodoSchema, UpdateTodoSchema } from "@/types/todo";
import { API } from "../base";

export const TODO_API = {
    getTodos: () => API.get('/api/todos').then(res => res.data.data),
    createTodo: (data: typeof TodoSchema) => API.post('/api/todos', data).then(res => res.data.data),
    deleteTodo: (id: string) => API.delete(`/api/todos/${id}`).then(res => res.data.data),
    updateTodo: (id: string, data: typeof UpdateTodoSchema) => API.put(`/api/todos/${id}`, data).then(res => res.data.data)
};