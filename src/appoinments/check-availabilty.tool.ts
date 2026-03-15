import { LuaTool } from 'lua-cli';
const { z } = require('zod') as typeof import('zod');

export class CheckAvailabilityTool implements LuaTool {
  name = 'check_availability';
  description =
    'Check available appointment slots for a specific date. ' +
    'Use when the user asks about free times, openings, or availability.';
  inputSchema = z.object({
    date: z
      .string()
      .describe(
        'The date to check in ISO 8601 format (YYYY-MM-DD). ' +
          'Resolve relative terms like "tomorrow" or "next Friday" before calling.',
      ),
  }) as unknown as LuaTool['inputSchema'];

  async execute(input: { date: string }): Promise<unknown> {
    const slots = this.generateMockSlots(input.date);

    if (slots.length === 0) {
      return {
        available: false,
        date: input.date,
        message: 'No available slots on this date.',
      };
    }

    return {
      available: true,
      date: input.date,
      slots,
      count: slots.length,
    };
  }

  private generateMockSlots(date: string): string[] {
    const day = new Date(date).getDay();
    if (day === 0 || day === 6) return [];
    return ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  }
}
