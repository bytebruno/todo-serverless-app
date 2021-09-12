import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoAccess } from '../dataLayer/TodoAccess'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodoAccess()

export async function getAllTodosForUser(userId: string): Promise<any> {
  return todoAccess.getAllTodosForUser(userId)
}

export async function createTodo(
  todoId: string,
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  return todoAccess.createTodo({
    todoId: todoId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    attachmentUrl: undefined
  } as TodoItem)
}

export async function updateTodo(
  todoId: string,
  updatedTodo: UpdateTodoRequest,
  userId: string
): Promise<void> {
  todoAccess.updateTodo(todoId, updatedTodo, userId)
}

export async function deleteTodo(
  todoId: string,
  userId: string
): Promise<void> {
  todoAccess.deleteTodo(todoId, userId)
}

export async function getPresignedImageUrl(
  todoId: string,
  imageId: string,
  userId: string
): Promise<string> {
  return todoAccess.getPresignedImageUrl(todoId, imageId, userId)
}
