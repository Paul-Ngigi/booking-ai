import { LuaTool } from 'lua-cli';

const { z } = require('zod') as typeof import('zod');

export class RescheduleAppointmentTool implements LuaTool {
  name = 'reschedule_appointment';
  description =
    'Reschedule an existing appointment to a new date and/or time. ' +
    'Use when the user wants to move, change, or shift an existing booking.';
  
  inputSchema = z.object({
    bookingId: z
      .string()
      .optional()
      .describe('Booking reference ID. Preferred lookup method.'),
    currentDate: z
      .string()
      .optional()
      .describe('Current appointment date (YYYY-MM-DD) — used if bookingId is unknown.'),
    name: z
      .string()
      .optional()
      .describe('Name on the booking — used if bookingId is unknown.'),
    newDate: z.string().describe('New appointment date in ISO 8601 format (YYYY-MM-DD).'),
    newTime: z.string().describe('New appointment time in 24-hour HH:MM format.'),
  }) as unknown as LuaTool['inputSchema'];

  async execute(input: {
    bookingId?: string;
    currentDate?: string;
    name?: string;
    newDate: string;
    newTime: string;
  }): Promise<unknown> {
    if (!input.bookingId && (!input.currentDate || !input.name)) {
      return {
        success: false,
        message:
          'Please provide either a booking ID or both the current date and the name on the booking.',
      };
    }
    
    const resolvedId =
      input.bookingId ?? `BK-LOOKUP-${input.currentDate}-${input.name}`;
    const newBookingId = `BK-${Date.now().toString(36).toUpperCase()}`;    

    return {
      success: true,
      originalBookingId: resolvedId,
      newBookingId,
      newDate: input.newDate,
      newTime: input.newTime,
      message:
        `Your appointment has been rescheduled to ${input.newDate} at ${input.newTime}. ` +
        `New booking reference: ${newBookingId}.`,
    };
  }
}