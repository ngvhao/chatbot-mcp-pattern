import { Injectable } from '@nestjs/common';

@Injectable()
export class ToolExecutor {
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execute(toolName: string, _args: any) {
    switch (toolName) {
      case 'getStudentSchedule':
        return 'Hello world';

      case 'getTuitionInfo':
        return 'Hello world';

      default:
        throw new Error(`Tool ${toolName} not allowed`);
    }
  }
}
