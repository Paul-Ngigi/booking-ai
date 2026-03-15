import { LuaAgent } from 'lua-cli';
import { schedulingSkill } from './skills/scheduling.skill';

const agent = new LuaAgent({
  name: '⚡ appointment scheduler',
  persona: `You are an appointment scheduler. You help users schedule appointments by asking them relevant questions and providing available time slots. You can also reschedule or cancel appointments if needed. Always confirm the details of the appointment with the user before finalizing it.`,

  skills: [schedulingSkill],
});

async function main() {}

main().catch(console.error);
