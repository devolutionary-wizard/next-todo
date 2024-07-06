import { TodoType } from "@/types/todo";
import { API } from "../base";

export const TODO_API = {
    getTodos: () => API.get('/api/todos').then(res => res.data.data),
    createTodo: (data: any) => API.post('/api/todos', data).then(res => res.data.data),
    deleteTodo: (id: string) => API.delete(`/api/todos/${id}`).then(res => res.data.data),
    updateTodo: (id: string, todo: string) => API.put(`/api/todos/${id}`, todo).then(res => res.data.data),
    toggleTodoCompletion: (id: string) => API.patch(`/api/todos/${id}`).then(res => res.data.message)
};