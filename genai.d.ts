declare module '@google/genai' {
  export enum Type {
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN',
    OBJECT = 'OBJECT',
    ARRAY = 'ARRAY'
  }

  export interface GenerateContentConfig {
    responseMimeType?: string;
    responseSchema?: any;
  }

  export interface GenerateContentRequest {
    model: string;
    contents: string;
    config?: GenerateContentConfig;
  }

  export interface GenerateContentResponse {
    text: string;
  }

  export interface Models {
    generateContent(request: GenerateContentRequest): Promise<GenerateContentResponse>;
  }

  export class GoogleGenAI {
    constructor(options: { apiKey: string });
    models: Models;
  }
}
