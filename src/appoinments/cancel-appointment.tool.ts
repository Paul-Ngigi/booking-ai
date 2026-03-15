import { LuaTool } from 'lua-cli';

const { z } = require('zod') as typeof import('zod');

export class CancelAppointmentTool implements LuaTool {
  name = 'cancel_appointment';
  description =
    'Cancel an existing appointment. Use when the user asks to cancel or remove a booking. ' +
    'Prefer bookingId when available; otherwise use date and name to look up the booking.';
  
  inputSchema = z.object({
    bookingId: z
      .string()
      .optional()
      .describe('The booking reference ID (e.g. BK-ABC123). Preferred lookup method.'),
    date: z
      .string()
      .optional()
      .describe('Appointment date in ISO 8601 format — used if bookingId is unknown.'),
    name: z
      .string()
      .optional()
      .describe('Name on the booking — used if bookingId is unknown.'),
  }) as unknown as LuaTool['inputSchema'];

  async execute(input: {
    bookingId?: string;
    date?: string;
    name?: string;
  }): Promise<unknown> {
    if (!input.bookingId && (!input.date || !input.name)) {
      return {
        success: false,
        message:
          'Please provide either a booking ID or both a date and the name on the booking.',
      };
    }    
    const resolvedId = input.bookingId ?? `BK-LOOKUP-${input.date}-${input.name}`;
    return {
      success: true,
      bookingId: resolvedId,
      message:
        `The appointment ${input.date ? `on ${input.date}` : ''} ` +
        `${input.name ? `for ${input.name}` : ''} has been successfully cancelled. ` +
        `Reference: ${resolvedId}.`,
    };
  }
}