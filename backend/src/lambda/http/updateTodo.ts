import 'source-map-support/register'

import * as middy from 'middy'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { cors, httpErrorHandler } from 'middy/middlewares'

// import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

// import { getUserId } from '../utils'
// import { updateTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    event.requestContext
    // const todoId = event.pathParameters.todoId
    // const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

    return undefined
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
