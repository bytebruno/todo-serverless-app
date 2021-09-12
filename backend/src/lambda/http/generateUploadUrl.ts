import 'source-map-support/register'

import * as middy from 'middy'
import * as uuid from 'uuid'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { decodeJWTFromAPIGatewayEvent, parseUserId } from '../../auth/utils'

import { createLogger } from '../../utils/logger'
import { getPresignedImageUrl } from '../../businessLogic/todo'

const logger = createLogger('todo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event)
    const todoId = event.pathParameters.todoId

    const jwtToken = decodeJWTFromAPIGatewayEvent(event)

    const userId = parseUserId(jwtToken)

    const imageId = uuid.v4()

    const signedUrl: string = await getPresignedImageUrl(
      todoId,
      imageId,
      userId
    )

    logger.info('todo IMAGE URL CREATED', {
      key: todoId,
      userId: userId,
      imageId: imageId,
      date: new Date().toISOString
    })

    return {
      statusCode: 201,
      body: JSON.stringify({ uploadUrl: signedUrl })
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
