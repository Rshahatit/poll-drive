// src/utils/logger.utils.ts
import { logger } from "../config/logger"

export const loggerUtils = {
  routeEntry: (controllerName: string, methodName: string, data?: any) => {
    logger.info(`Entering ${controllerName}.${methodName}`, { data })
  },

  routeExit: (controllerName: string, methodName: string, data?: any) => {
    logger.info(`Exiting ${controllerName}.${methodName}`, { data })
  },

  routeError: (controllerName: string, methodName: string, error: any) => {
    logger.error(`Error in ${controllerName}.${methodName}`, {
      error: {
        message: error.message,
        stack: error.stack,
      },
    })
  },

  dbOperation: (operation: string, model: string, data?: any) => {
    logger.debug(`Database ${operation} on ${model}`, { data })
  },

  apiCall: (service: string, method: string, data?: any) => {
    logger.debug(`External API call to ${service}.${method}`, { data })
  },
}
