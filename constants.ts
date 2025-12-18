import { Choice } from './types';

export const NARRATIVE = {
  INTRO: {
    title: "The Werewolf",
    subtitle: "Iron & Snow",
    description: "It is a northern country; they have cold weather, they have cold hearts. Cold; tempest; wild beasts in the forest. It is a hard life."
  },
  HOME: {
    description: "Their houses are built of logs, dark and smoky within. There is a crude icon of the virgin behind a guttering candle, the leg of a pig hung up to cure, a string of drying mushrooms.",
    mother: "Mother speaks: 'Go and visit grandmother, who has been sick. Take her the oatcakes I've baked for her on the hearthstone and a little pot of butter.'"
  },
  WOODS_EVENTS: [
    {
      mile: 1,
      text: "You pass the graveyard. The graves are marked with portraits of the deceased in the naif style. No flowers grow here.",
      choices: [
        {
          id: 'pray',
          text: "Place a votive offering",
          fallbackText: "You leave a small loaf. The bears will lumber from the margins to snatch it away."
        },
        {
          id: 'devil',
          text: "Look for the Devil",
          fallbackText: "They say at midnight the Devil holds picnics here and invites the witches to eat fresh corpses."
        },
        {
          id: 'ignore',
          text: "Walk past",
          fallbackText: "You keep walking. The cold wind bites."
        }
      ]
    },
    {
      mile: 2,
      text: "The path narrows. The trees close in. You hear a rustling in the undergrowth.",
      choices: [
        {
          id: 'hide',
          text: "Hide in the snow",
          fallbackText: "You crouch in the snow. Innocence is no protection here."
        },
        {
          id: 'knife',
          text: "Draw your knife",
          fallbackText: "You grip the handle of your father's knife. You know how to use it."
        }
      ]
    },
    {
      mile: 3,
      text: "You see a wreath of garlic on a tree stump, fallen from a woodcutter's door.",
      choices: [
        {
          id: 'take',
          text: "Kick it aside",
          fallbackText: "You kick the wreath. Garlic keeps out the vampires, they say."
        },
        {
          id: 'examine',
          text: "Check for tracks",
          fallbackText: "You ignore the charm. You scan the snow for the spoor of beasts."
        }
      ]
    },
    {
      mile: 4,
      text: "The snow begins to fall thickly. The path is obscured.",
      choices: [
        {
          id: 'shiver',
          text: "Pull your sheepskin tight",
          fallbackText: "Your scabby coat of sheepskin keeps out the cold, but barely."
        },
        {
          id: 'harden',
          text: "Embrace the freeze",
          fallbackText: "You are a mountaineer's child. You do not die of fright."
        }
      ]
    }
  ],
  AMBUSH: {
    intro: "Mile 5. A freezing howl tears through the air. You drop your gifts. You seize your knife.",
    description: "It is a huge one, with red eyes and running, grizzled chops."
  },
  TRANSFORMATION: {
    text: "The wolf let out a gulp, almost a sob. It went lolloping off on three legs, leaving a trail of blood. You wipe the blade on your apron.",
    prompt: "You wrap the wolf's paw in the cloth in which your mother had packed the oatcakes and go on towards grandmother's house."
  },
  COTTAGE: {
    intro: "Grandmother is so sick she has taken to her bed, moaning and shaking with fever. You feel her forehead; it burns.",
    dialogue: "You shake out the cloth from her basket to make her a cold compress...",
    reveal: "...and the wolf's paw falls to the floor. But it is no longer a wolf's paw. It is a hand, chopped off at the wrist, toughened with work and freckled with old age. There is a wedding ring on the third finger and a wart on the index finger.",
    confrontation: "You pull back the sheet. The old woman wakes up, squawking and shrieking like a thing possessed. But the child is strong, and armed with her father's hunting knife. There is a bloody stump where her right hand should have been, festering already."
  },
  GAME_OVER: {
    title: "The Fairy Tale Trap",
    text: "You tried to be kind in a cruel world. But this is not that kind of story. While you slept, grandmother returned to wolf!"
  },
  ENDING: {
    title: "She Prospered",
    text: "The neighbours knew the wart on the hand at once for a witch's nipple. They drove the old woman, in her shift as she was, out into the snow with sticks, beating her old carcass as far as the edge of the forest, and pelted her with stones until she fell down dead. Now you live in her house; you prosper."
  }
};