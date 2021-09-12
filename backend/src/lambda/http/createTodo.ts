import * as middy from 'middy'
import * as uuid from 'uuid'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { decodeJWTFromAPIGatewayEvent, parseUserId } from '../../auth/utils'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import { createTodo } from '../../businessLogic/todo'

const logger = createLogger('todo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event)

    const todoRequest: CreateTodoRequest = JSON.parse(event.body)

    const todoId = uuid.v4()
    const jwtToken = decodeJWTFromAPIGatewayEvent(event)

    const userId = parseUserId(jwtToken)

    const newTodo = await createTodo(todoId, todoRequest, userId)

    logger.info('todo CREATED', {
      key: todoId,
      userId: userId,
      date: new Date().toISOString
    })

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newTodo
      })
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
