import 'source-map-support/register'

import * as middy from 'middy'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { cors } from 'middy/middlewares'

// import { createTodo } from '../../businessLogic/todos'
// import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    newTodo
    event.requestContext

    return undefined
  }
)

handler.use(
  cors({
    credentials: true
  })
)
