"use client";
import { apis } from "@/api";
import { TodoType } from "@/types/todo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast, Toaster } from "sonner";


export default function Home() {
  const [todo, setTodo] = useState<string>('');
  const [modal, seteModal] = useState<boolean>(false)
  const [selectedTodo, setSelectedTodo] = useState<TodoType | null>(null);
  const [updatedTodo, setUpdatedTodo] = useState<string>('')

  const queryClient = useQueryClient();

  const { data, isLoading: isFetchingTodo } = useQuery<TodoType[]>({
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
        setTodo('');
        toast.success('Todo added successfully');
      },
      onError: (error: any) => {
        toast.error('Error creating todo');
      }
    });
  }

  const markTodoAsCompleteMutation = useMutation({
    mutationFn: apis.todo.toggleTodoCompletion,
  });

  const handleMarkTodoAsComplete = (id: string) => {
    markTodoAsCompleteMutation.mutate(id, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['todos']
        });
        toast.success(data);
      },
      onError: (error: any) => {
        toast.error('Error marking todo as complete');
      }
    });
  }

  const updateTodoMutation = useMutation(
    { mutationFn: ({ id, data }: { id: string; data: string }) => apis.todo.updateTodo(id, data) }
  );

  const handleUpdateTodo = (id: string, data: any) => {
    updateTodoMutation.mutate({ id, data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['todos']
        });
        toast.success('Todo updated successfully');
        closeEditModal()
      },
      onError: (error: any) => {
        toast.error('Error updating todo');
      }
    });
  }

  const openEditModal = (todo: TodoType) => {
    setSelectedTodo(todo);
    seteModal(true);
  }

  const closeEditModal = () => {
    seteModal(false);
    setSelectedTodo(null);
    setUpdatedTodo('');
  }

  console.log(selectedTodo)


  return (
    <div className="bg-orange-200 flex justify-center items-center h-screen">
      <Toaster />
      <div className="container w-full max-w-2xl">
        <div className="text-3xl text-center font-bold mb-3 uppercase">Todo List</div>
        {/* Form input */}
        <form className="flex justify-center" onSubmit={handleSubmit}>
          <input type="text" name="todo" placeholder="Enter Todo" className="text-xl text-orange-800 placeholder-orange-400 py-2 px-5 bg-orange-100 rounded-l-full outline-orange-300" value={todo} onChange={(e) => setTodo(e.target.value)} />
          <button type="submit" className="text-xl text-orange-100 placeholder-orange-400 py-2 pr-5 pl-4 bg-orange-500 rounded-r-full">
            <AddIcon />
          </button>
        </form>
        {modal &&
          <>
            <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                    <h3 className="text-md text-center font-bold mb-3">Enter New Information</h3>
                  </div>
                  <div className="relative p-6 flex-auto">
                    <form className="">
                      <input className="text-xl text-orange-800 placeholder-orange-400 py-2 px-5 bg-orange-100 rounded-full outline-orange-300" value={updatedTodo} onChange={(event) => setUpdatedTodo(event.target.value)} />
                    </form>
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      onClick={closeEditModal}
                    >
                      Close
                    </button>
                    <button
                      className="text-white bg-orange-500 active:bg-orange-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      onClick={() => handleUpdateTodo(selectedTodo!.id, updatedTodo)}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
        <div className="bg-gray-100 mt-5 p-5 rounded-xl shadow-lg text-gray-700">
          <h1 className="font-bold text-xl italic block mb-0 leading-none">Todo&apos;s</h1>
          <small className="block mb-5 mt-0 text-xs text-gray-500">{data?.filter((todo: any) => !todo.isCompleted).length} Todos pending, {data?.filter((todo: any) => todo.isCompleted).length} Completed.</small>
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
                {isFetchingTodo ? (
                  <tr>
                    <td className="text-center" colSpan={3}>Loading...</td>
                  </tr>
                ) : (
                  <>
                    {data?.length === 0 && (
                      <tr>
                        <td className="text-center px-1 py-2 text-orange-800" colSpan={3}>No Todos found. Add a few to begin.</td>
                      </tr>
                    )}

                    {Array.isArray(data) && data.map((todo: TodoType, index) => (
                      <tr key={index} className={`${!todo.isCompleted ? 'odd:bg-orange-100 even:bg-orange-50 transition duration-300' : 'bg-green-100 line-through'}`}>
                        <td className="text-center px-1 py-2 text-orange-800">{index + 1}</td>
                        <td className="px-1 py-2 text-orange-800">{todo.todo}</td>
                        <td className="text-center px-1 py-2 text-orange-800 flex gap-3 justify-start">
                          {!todo.isCompleted && (
                            <button onClick={() => handleMarkTodoAsComplete(todo.id)} className="text-center px-1 py-2 text-orange-800 flex gap-3 justify-start">
                              <InCompletedIcon />
                            </button>
                          )}
                          {todo.isCompleted && (
                            <button onClick={() => handleMarkTodoAsComplete(todo.id)} className="text-orange-600">
                              <CompletedIcon />
                            </button>
                          )}

                          <button onClick={() => handleDeleteTodo(todo.id)} className="text-orange-600">
                            <DeleteIcon />
                          </button>
                          <button onClick={() => openEditModal(todo)} className="text-orange-600">
                            <EditIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div >
  );
}

const EditIcon = () => <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
  <g strokeWidth="0"></g>
  <g strokeLinecap="round" strokeLinejoin="round"></g>
  <g>
    <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
  </g>
</svg>

const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
</svg>

const CompletedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>

const InCompletedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
</svg>

const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
</svg>