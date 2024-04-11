import { NextFunction, Request, Response } from "express";

export const mockResponse = {
  locals: {
    languageCode: "en"
  },
  status: (statusCode: any) => {
    return {
      send: (data: any) => {
        return data;
      }
    };
  }
} as unknown as Response;

export const mockRequest = (body: any) => {
  const query = body;
  return { body, query } as Request;
};

export const mockNextFunction: NextFunction = (err?: any) => {
  if (err) {
    throw err;
  }
};
