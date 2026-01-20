import type { LLMTool } from '../types';

export const tools: LLMTool[] = [
  {
    name: 'getStudentSchedule',
    description: 'Lấy lịch học hiện tại của sinh viên',
    inputSchema: {
      type: 'object',
      properties: {
        studentId: {
          type: 'string',
          description: 'Mã sinh viên',
        },
      },
      required: ['studentId'],
    },
  },
  {
    name: 'getTuitionInfo',
    description: 'Lấy thông tin học phí của sinh viên',
    inputSchema: {
      type: 'object',
      properties: {
        studentId: { type: 'string' },
      },
      required: ['studentId'],
    },
  },
];
