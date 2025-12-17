// API dependency removed. Using local logic.

const ATMOSPHERIC_WHISPERS = [
  "The wind howls through the black trees.",
  "Snow crunches underfoot, loud as a breaking bone.",
  "You feel eyes watching you from the darkness.",
  "The cold is a physical weight on your shoulders.",
  "A raven croaks, a harsh sound in the silence.",
  "The smell of woodsmoke is faint and distant.",
  "Your breath clouds the air, freezing instantly.",
  "Something moves in the periphery of your vision.",
  "The forest is silent, waiting."
];

export const getAtmosphericDescription = async (context: string, coldHeartLevel: number): Promise<string> => {
  // Simulate a brief pause for atmosphere
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const randomIndex = Math.floor(Math.random() * ATMOSPHERIC_WHISPERS.length);
  return ATMOSPHERIC_WHISPERS[randomIndex];
};

export const getNarrativeOutcome = async (narrativePrompt: string, choiceText: string, coldHeartLevel: number, fallback: string): Promise<string> => {
  // Simulate "thinking" or processing time
  await new Promise(resolve => setTimeout(resolve, 600));

  // Return the fallback text defined in constants.ts
  return fallback;
};
