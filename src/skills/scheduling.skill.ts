import { LuaSkill } from 'lua-cli';
import { BookAppointmentTool } from '../appoinments/book-appointment.tool';
import { CancelAppointmentTool } from '../appoinments/cancel-appointment.tool';
import { CheckAvailabilityTool } from '../appoinments/check-availabilty.tool';
import { RescheduleAppointmentTool } from '../appoinments/reschedule-appointment.tool';

export const schedulingSkill = new LuaSkill({
  name: 'appointment-scheduling',
  description: 'Handles all appointment scheduling operations.',
  context:
    'Use these tools whenever the conversation involves checking availability, ' +
    'booking, cancelling, or rescheduling appointments. ' +
    'Always confirm details with the user before executing a booking, cancellation, or reschedule.',
  tools: [
    new CheckAvailabilityTool(),
    new BookAppointmentTool(),
    new CancelAppointmentTool(),
    new RescheduleAppointmentTool(),
  ],
});
