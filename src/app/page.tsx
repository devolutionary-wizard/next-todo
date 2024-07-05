"use client";
import { apis } from "@/api";
import { TodoSchema } from "@/types/todo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { z } from "zod";

type Todo = z.infer<typeof TodoSchema>;

export default function Home() {
  const [todo, setTodo] = useState('');

  const queryClient = useQueryClient();

  const { data } = useQuery<Todo[]>({
    queryKey: ['todos'], queryFn: apis.todo.getTodos
  })

  const deleteTodoMutation = useMutation({
    mutationFn: apis.todo.deleteTodo,
  });

  const handleDeleteTodo = (id: string) => {
    deleteTodoMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['todos']
        });
        toast.success('Todo deleted successfully');
      },
      onError: (error: any) => {
        toast.error('Error deleting todo');
      }
    });
  }

  const createTodoMutation = useMutation({
    mutationFn: apis.todo.createTodo,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!todo.trim()) {
      toast.error('Todo cannot be empty');
      return;
    }
    createTodoMutation.mutate({ todo }, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['todos']
        });
        console.log('Todo added successfully');
        toast.success('Todo added successfully');
      },
      onError: (error: any) => {
        toast.error('Error creating todo');
      }
    });
  }


  return (
    <div className="bg-orange-200 flex justify-center items-center h-screen">
      <Toaster />
      <div className="container w-full max-w-2xl">
        <div className="text-3xl text-center font-bold mb-3 uppercase">Todo List</div>
        {/* Form input */}
        <form className="flex justify-center" onSubmit={handleSubmit}>
          <input type="text" name="todo" placeholder="Enter Todo" className="text-xl text-orange-800 placeholder-orange-400 py-2 px-5 bg-orange-100 rounded-l-full outline-orange-300" value={todo} onChange={(e) => setTodo(e.target.value)} />
          <button type="submit" className="text-xl text-orange-100 placeholder-orange-400 py-2 pr-5 pl-4 bg-orange-500 rounded-r-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </form>

        <div className="bg-gray-100 mt-5 p-5 rounded-xl shadow-lg text-gray-700">
          <h1 className="font-bold text-xl italic block mb-0 leading-none">Todo&apos;s</h1>
          <div className="max-h-80 overflow-y-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="text-center px-1 py-2 bg-orange-500 text-orange-100 rounded-tl-xl">#</th>
                  <th className="text-left px-1 py-2 bg-orange-500 text-orange-100">Todo</th>
                  <th className=" px-1 py-2 bg-orange-500 text-orange-100 rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.length == 0 &&
                  <tr>
                    <td className="text-center px-1 py-2 text-orange-800" colSpan={3}>No Todos found. Add a few to begin.</td>
                  </tr>
                }
                {Array.isArray(data) && data.map((todo: Todo, index) => (
                  <tr key={index}>
                    <td className="text-center px-1 py-2 text-orange-800">{index + 1}</td>
                    <td className=" px-1 py-2 text-orange-800">{todo.todo}</td>
                    <td className="text-center  px-1 py-2 text-orange-800 flex gap-3 justify-start">
                      {!todo.isCompleted && <button className="text-center  px-1 py-2 text-orange-800 flex gap-3 justify-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      }
                      {todo.isCompleted &&
                        <button className="text-orange-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      }

                      <button onClick={() => handleDeleteTodo(todo.id)} className="text-orange-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div >
  );
}
