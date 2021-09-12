import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { FileStorageS3 } from '../fileStorageLogic/s3'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)
export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
    private readonly storage = new FileStorageS3()
  ) {}

  async getAllTodosForUser(userId: string): Promise<any> {
    console.log('userId: ', userId)
    return this.docClient
      .query({
        TableName: this.todoTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    this.docClient
      .put({
        TableName: this.todoTable,
        Item: todo
      })
      .promise()

    return todo
  }

  async updateTodo(
    todoId: string,
    updatedTodo: UpdateTodoRequest,
    userId: string
  ): Promise<void> {
    console.log('Updating todoId: ', todoId, ' userId: ', userId)

    this.docClient.update(
      {
        TableName: this.todoTable,
        Key: {
          userId,
          todoId
        },
        UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',
        ExpressionAttributeValues: {
          ':n': updatedTodo.name,
          ':due': updatedTodo.dueDate,
          ':d': updatedTodo.done
        },
        ExpressionAttributeNames: {
          '#name': 'name',
          '#dueDate': 'dueDate',
          '#done': 'done'
        }
      },
      (err, data) => {
        if (err) {
          console.log('ERRROR ' + err)
          throw new Error('Error ' + err)
        } else {
          console.log('Element updated ' + data)
        }
      }
    )
  }

  async deleteTodo(todoId: string, userId: string): Promise<void> {
    this.docClient.delete(
      {
        TableName: this.todoTable,
        Key: {
          userId,
          todoId
        }
      },
      (err, data) => {
        if (err) {
          console.log('ERROR ' + err)
          throw new Error('Error ' + err)
        } else {
          console.log('Element deleted ' + data)
        }
      }
    )
  }
  async getPresignedImageUrl(
    todoId: string,
    imageId: string,
    userId: string
  ): Promise<string> {
    const attachmentUrl = await this.storage.getPresignedImageUrl(imageId)

    this.docClient.update(
      {
        TableName: this.todoTable,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': `https://${this.bucketName}.s3.amazonaws.com/${imageId}`
        }
      },
      (err, data) => {
        if (err) {
          console.log('ERROR ' + err)
          throw new Error('Error ' + err)
        } else {
          console.log('Element updated ' + data)
        }
      }
    )
    return attachmentUrl
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
