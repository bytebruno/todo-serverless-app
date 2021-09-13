import * as middy from 'middy'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { decodeJWTFromAPIGatewayEvent, parseUserId } from '../../auth/utils'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { updateTodo } from '../../businessLogic/todo'

const logger = createLogger('todo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    const jwtToken = decodeJWTFromAPIGatewayEvent(event)
    const userId = parseUserId(jwtToken)

    await updateTodo(todoId, updatedTodo, userId)

    logger.info('todo UPDATED', {
      key: todoId,
      userId: userId,
      date: new Date().toISOString
    })
    return {
      statusCode: 200,
      body: JSON.stringify(true)
    }
  }
)

handler
  .use(
    cors({
      credentials: true
    })
  )
  .use(httpErrorHandler())
