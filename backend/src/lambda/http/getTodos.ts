import 'source-map-support/register'

import * as middy from 'middy'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { decodeJWTFromAPIGatewayEvent, parseUserId } from '../../auth/utils'

import { getAllTodosForUser } from '../../businessLogic/todo'

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event)

    const jwtToken = decodeJWTFromAPIGatewayEvent(event)
    const userId = parseUserId(jwtToken)

    const result = await getAllTodosForUser(userId)

    if (result.count !== 0) {
      console.log(result)
      return {
        statusCode: 200,
        body: JSON.stringify({ items: result.Items })
      }
    }

    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Item not found'
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
