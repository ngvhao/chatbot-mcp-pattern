import { Injectable } from '@nestjs/common';

@Injectable()
export class ToolExecutor {
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execute(toolName: string, _args: any) {
    switch (toolName) {
      case 'getStudentSchedule':
        return { result: 'Thứ 2: Toán, Thứ 3: Lý, Thứ 4: Hóa' };

      case 'getTuitionInfo':
        return { result: 'Học phí: 10 triệu VNĐ/ năm' };

      default:
        throw new Error(`Tool ${toolName} not allowed`);
    }
  }
}
