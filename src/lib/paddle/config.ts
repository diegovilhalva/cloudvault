import { Environment, LogLevel, Paddle } from '@paddle/paddle-node-sdk'
import { PADDLE_API_KEY } from '../env'

const paddle = new Paddle(PADDLE_API_KEY, {
    environment: Environment.sandbox,
    logLevel: LogLevel.verbose
})

export default paddle