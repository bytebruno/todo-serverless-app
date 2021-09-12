import * as middy from 'middy'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { decodeJWTFromAPIGatewayEvent, parseUserId } from '../../auth/utils'

import { createLogger } from '../../utils/logger'
import { deleteTodo } from '../../businessLogic/todo'

const logger = createLogger('todo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event)
    const todoId = event.pathParameters.todoId

    const jwtToken = decodeJWTFromAPIGatewayEvent(event)

    const userId = parseUserId(jwtToken)

    await deleteTodo(todoId, userId)

    logger.info('todo DELETED', {
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
