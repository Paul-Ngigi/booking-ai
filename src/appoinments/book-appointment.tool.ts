import { LuaTool } from 'lua-cli';
const { z } = require('zod') as typeof import('zod');

export class BookAppointmentTool implements LuaTool {
  name = 'book_appointment';
  description =
    'Book an appointment for the user at a specific date and time. ' +
    'Use when the user confirms they want to book a slot.';
  
  inputSchema = z.object({
    date: z.string().describe('Appointment date in ISO 8601 format (YYYY-MM-DD).'),
    time: z
      .string()
      .describe('Appointment time in 24-hour HH:MM format (e.g. "14:00").'),
    name: z.string().describe('Full name of the person booking the appointment.'),
    reason: z
      .string()
      .optional()
      .describe('Optional reason or description for the appointment.'),
  }) as unknown as LuaTool['inputSchema'];

  async execute(input: {
    date: string;
    time: string;
    name: string;
    reason?: string;
  }): Promise<unknown> {    
    const bookingId = this.generateBookingId();    

    return {
      success: true,
      bookingId,
      date: input.date,
      time: input.time,
      name: input.name,
      reason: input.reason ?? 'General appointment',
      confirmationMessage:
        `Appointment confirmed for ${input.name} on ${input.date} at ${input.time}. ` +
        `Your booking reference is ${bookingId}.`,
    };
  }
  
  private generateBookingId(): string {
    return `BK-${Date.now().toString(36).toUpperCase()}`;
  }
}