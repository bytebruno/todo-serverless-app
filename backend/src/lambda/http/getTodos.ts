import 'source-map-support/register'

import * as middy from 'middy'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

// import { cors } from 'middy/middlewares'
// import { getTodosForUser } from '../../businessLogic/todos'
// import { getUserId } from '../utils'

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    event.requestContext
    // Write your code here
    //const todos = '...'

    return undefined
  }
)

//     handler.use(
//       cors({
//         credentials: true
//       })
//     )
//   }
// )
