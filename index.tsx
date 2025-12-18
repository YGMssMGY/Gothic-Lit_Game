/**
 * IRON & SNOW: THE WEREWOLF
 * A Vanilla JS interactive story based on Angela Carter.
 */

// --- CONSTANTS & NARRATIVE ---

const NARRATIVE = {
  INTRO: {
    title: "THE WEREWOLF",
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
        { id: 'pray', text: "Place a votive offering", outcome: "You leave a small loaf. The bears will lumber from the margins to snatch it away." },
        { id: 'devil', text: "Look for the Devil", outcome: "They say at midnight the Devil holds picnics here and invites the witches to eat fresh corpses." },
        { id: 'ignore', text: "Walk past", outcome: "You keep walking. The cold wind bites." }
      ]
    },
    {
      mile: 2,
      text: "The path narrows. The trees close in. You hear a rustling in the undergrowth.",
      choices: [
        { id: 'hide', text: "Hide in the snow", outcome: "You crouch in the snow. Innocence is no protection here." },
        { id: 'knife', text: "Draw your knife", outcome: "You grip the handle of your father's knife. You know how to use it." }
      ]
    },
    {
      mile: 3,
      text: "You see a wreath of garlic on a tree stump, fallen from a woodcutter's door.",
      choices: [
        { id: 'take', text: "Kick it aside", outcome: "You kick the wreath. Garlic keeps out the vampires, they say." },
        { id: 'examine', text: "Check for tracks", outcome: "You ignore the charm. You scan the snow for the spoor of beasts." }
      ]
    },
    {
      mile: 4,
      text: "The snow begins to fall thickly. The path is obscured.",
      choices: [
        { id: 'shiver', text: "Pull your sheepskin tight", outcome: "Your scabby coat of sheepskin keeps out the cold, but barely." },
        { id: 'harden', text: "Embrace the freeze", outcome: "You are a mountaineer's child. You do not die of fright." }
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
    reveal: "...and the wolf's paw falls to the floor. But it is no longer a wolf's paw. It is a hand, chopped off at the wrist, toughened with work. There is a wedding ring on the third finger.",
    confrontation: "You pull back the sheet. The old woman wakes up, squawking and shrieking like a thing possessed. But the child is strong. There is a bloody stump where her right hand should have been."
  },
  GAME_OVER: {
    title: "THE TRAP",
    text: "You tried to be kind in a cruel world. But this is not that kind of story. While you slept, grandmother returned to wolf and finished what she started."
  },
  ENDING: {
    title: "SHE PROSPERED",
    text: "The neighbours knew the wart on the hand at once for a witch's nipple. They drove the old woman out into the snow and pelted her with stones until she fell down dead. Now you live in her house; you prosper."
  }
};

const ITEMS = {
  OATCAKES: { id: 'oatcakes', name: 'Oatcakes', icon: '🍪', desc: 'Baked on the hearthstone.' },
  BUTTER: { id: 'butter', name: 'Pot of Butter', icon: '🏺', desc: 'A fatty offering.' },
  KNIFE: { id: 'knife', name: "Father's Knife", icon: '🗡️', desc: 'Iron. Rusted. Sharp.' }
};

// --- STATE MANAGEMENT ---

let state = {
  phase: 'INTRO', // INTRO, HOME, WOODS, AMBUSH, TRANSFORMATION, COTTAGE, ENDING, GAMEOVER
  inventory: [],
  distance: 1,
  log: [],
  waiting: false,
  cottageStep: 0,
  inventoryOpen: false
};

const root = document.getElementById('root');

function setState(updater) {
  state = { ...state, ...updater };
  render();
}

// --- UTILS ---

function addToLog(text) {
  state.log.push(text);
  render();
  const logEl = document.getElementById('narrative-log');
  if (logEl) logEl.scrollTop = logEl.scrollHeight;
}

// --- VIEW COMPONENTS ---

function render() {
  if (!root) return;

  if (state.phase === 'INTRO') {
    root.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in-up">
        <h1 class="text-6xl md:text-9xl font-serif text-blood tracking-tighter mb-2">THE WEREWOLF</h1>
        <h2 class="text-xl md:text-2xl text-gray-600 font-serif italic mb-12">IRON & SNOW</h2>
        <p class="text-gray-400 max-w-lg leading-relaxed font-serif mb-12">
          "${NARRATIVE.INTRO.description}"
        </p>
        <button id="start-btn" class="px-12 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95">
          Enter the Woods
        </button>
      </div>
    `;
    document.getElementById('start-btn')?.addEventListener('click', () => {
      state.phase = 'HOME';
      state.log = [NARRATIVE.HOME.description, NARRATIVE.HOME.mother];
      render();
    });
    return;
  }

  root.innerHTML = `
    <div class="flex flex-col h-full max-w-2xl mx-auto p-4 md:p-8">
      <!-- Narrative Log -->
      <div id="narrative-log" class="flex-1 overflow-y-auto space-y-6 mb-8 pr-4 relative scroll-smooth">
        ${state.log.map(text => `
          <p class="text-lg font-serif leading-relaxed text-gray-300 border-l-2 border-gray-800 pl-6 py-1 animate-fade-in-up">
            ${text}
          </p>
        `).join('')}
      </div>

      <!-- Controls -->
      <div id="controls" class="bg-charcoal/80 border border-gray-800 rounded-lg p-6 min-h-[180px] flex flex-col justify-center">
        ${renderControls()}
      </div>

      <!-- Inventory Trigger -->
      <button id="inventory-toggle" class="fixed bottom-6 right-6 p-4 bg-gray-900 border border-gray-700 text-gray-300 rounded-full hover:bg-gray-800 transition-all shadow-xl z-30">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>
      </button>

      <!-- Inventory Modal -->
      ${state.inventoryOpen ? renderInventory() : ''}
    </div>
  `;

  attachEventListeners();
}

function renderControls() {
  switch (state.phase) {
    case 'HOME':
      return `
        <div class="text-center space-y-4">
          <p class="text-xs uppercase tracking-widest text-gray-500 mb-2">Prepare your basket</p>
          <div class="flex justify-center gap-4">
            ${Object.values(ITEMS).map(item => {
              const collected = state.inventory.find(i => i.id === item.id);
              return `
                <button 
                  data-action="collect" 
                  data-id="${item.id}" 
                  class="flex flex-col items-center p-3 border rounded-md transition-all ${collected ? 'opacity-30 border-gray-800' : 'border-gray-700 hover:border-gray-400 active:scale-95'}"
                  ${collected ? 'disabled' : ''}
                >
                  <span class="text-2xl mb-1">${item.icon}</span>
                  <span class="text-[10px] font-bold uppercase">${item.name}</span>
                </button>
              `;
            }).join('')}
          </div>
          ${state.inventory.length === 3 ? `
            <button id="leave-btn" class="w-full py-3 mt-4 action-primary rounded animate-pulse">Leave for Grandmother's</button>
          ` : ''}
        </div>
      `;

    case 'WOODS':
      if (state.waiting) {
        return `<button id="advance-btn" class="w-full py-4 action-primary rounded flex items-center justify-center gap-2">Trudge Deeper into the Cold</button>`;
      }
      const event = NARRATIVE.WOODS_EVENTS[state.distance - 1];
      return `
        <div class="space-y-4">
          <p class="text-center text-[10px] text-gray-500 uppercase tracking-tighter">Mile ${state.distance} of 5</p>
          <div class="grid grid-cols-1 gap-2">
            ${event.choices.map(c => `
              <button data-action="choice" data-id="${c.id}" class="choice-btn w-full p-4 text-left rounded text-sm font-medium hover:text-white">
                ${c.text}
              </button>
            `).join('')}
          </div>
        </div>
      `;

    case 'AMBUSH':
      return `
        <div class="space-y-4">
          <p class="text-center text-red-500 font-bold tracking-widest animate-pulse">THE BEAST IS UPON YOU</p>
          <button id="strike-btn" class="w-full py-6 action-primary border-4 border-white text-2xl">SLASH THE RIGHT FOREPAW</button>
        </div>
      `;

    case 'TRANSFORMATION':
      return `
        <div class="text-center">
          <button id="arrive-btn" class="w-full py-4 action-primary rounded">Approach the Cottage</button>
        </div>
      `;

    case 'COTTAGE':
      if (state.cottageStep === 0) {
        return `<button id="compress-btn" class="w-full py-4 action-primary rounded">Make a Cold Compress</button>`;
      }
      if (state.cottageStep === 1) {
        return `<button id="confront-btn" class="w-full py-4 action-primary rounded">Check the Bedding</button>`;
      }
      return `
        <div class="grid grid-cols-2 gap-4">
          <button id="mercy-btn" class="p-4 border border-gray-700 text-gray-500 hover:text-gray-300">Show Mercy</button>
          <button id="ruthless-btn" class="p-4 action-primary">Call the Neighbours</button>
        </div>
      `;

    case 'ENDING':
      return `
        <div class="text-center space-y-4">
          <h3 class="text-2xl font-serif text-white">She prospered.</h3>
          <button id="restart-btn" class="text-gray-500 hover:text-white text-sm underline">Reincarnate</button>
        </div>
      `;

    case 'GAMEOVER':
      return `
        <div class="text-center space-y-4">
          <h3 class="text-2xl font-serif text-blood">Death in the Snow</h3>
          <button id="restart-btn" class="text-gray-500 hover:text-white text-sm underline">Try Again</button>
        </div>
      `;

    default:
      return '';
  }
}

function renderInventory() {
  return `
    <div class="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      <div class="bg-charcoal border border-blood w-full max-w-sm p-8 relative">
        <button id="inventory-close" class="absolute top-4 right-4 text-gray-500">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <h2 class="text-blood font-serif text-2xl border-b border-gray-800 pb-2 mb-6 tracking-widest">BASKET</h2>
        <div class="space-y-4">
          ${state.inventory.length === 0 ? '<p class="italic text-gray-600">Empty...</p>' : ''}
          ${state.inventory.map(item => `
            <div class="flex items-center gap-4 p-2 border border-gray-800">
              <span class="text-3xl">${item.icon}</span>
              <div>
                <p class="font-bold text-gray-200 text-sm">${item.name}</p>
                <p class="text-[10px] text-gray-500 font-serif">${item.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// --- LOGIC ---

function attachEventListeners() {
  // Collection
  document.querySelectorAll('[data-action="collect"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id.toUpperCase();
      state.inventory.push(ITEMS[id]);
      addToLog(`You placed the ${ITEMS[id].name} into your basket.`);
    });
  });

  // Home Phase
  document.getElementById('leave-btn')?.addEventListener('click', () => {
    state.phase = 'WOODS';
    state.distance = 1;
    addToLog(NARRATIVE.WOODS_EVENTS[0].text);
  });

  // Woods Choices
  document.querySelectorAll('[data-action="choice"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const event = NARRATIVE.WOODS_EVENTS[state.distance - 1];
      const choice = event.choices.find(c => c.id === id);
      addToLog(choice.outcome);
      state.waiting = true;
      render();
    });
  });

  // Advance
  document.getElementById('advance-btn')?.addEventListener('click', () => {
    state.waiting = false;
    state.distance++;
    if (state.distance > 4) {
      state.phase = 'AMBUSH';
      state.inventory = state.inventory.filter(i => i.id === 'knife');
      addToLog(NARRATIVE.AMBUSH.intro);
      addToLog(NARRATIVE.AMBUSH.description);
    } else {
      addToLog(NARRATIVE.WOODS_EVENTS[state.distance - 1].text);
    }
    render();
  });

  // Ambush
  document.getElementById('strike-btn')?.addEventListener('click', () => {
    state.phase = 'TRANSFORMATION';
    state.inventory.push({ id: 'paw', name: "The Wolf's Paw", icon: '🐾', desc: 'Wrapped in a cloth.' });
    addToLog(NARRATIVE.TRANSFORMATION.text);
    addToLog(NARRATIVE.TRANSFORMATION.prompt);
  });

  // Arrival
  document.getElementById('arrive-btn')?.addEventListener('click', () => {
    state.phase = 'COTTAGE';
    state.cottageStep = 0;
    addToLog(NARRATIVE.COTTAGE.intro);
  });

  // Cottage Sequence
  document.getElementById('compress-btn')?.addEventListener('click', () => {
    addToLog(NARRATIVE.COTTAGE.dialogue);
    setTimeout(() => {
      state.cottageStep = 1;
      state.inventory = state.inventory.map(i => i.id === 'paw' ? { ...i, name: 'A Severed Hand', icon: '🖐️', desc: 'Freckled and ringed.' } : i);
      addToLog(NARRATIVE.COTTAGE.reveal);
    }, 1000);
  });

  document.getElementById('confront-btn')?.addEventListener('click', () => {
    state.cottageStep = 2;
    addToLog(NARRATIVE.COTTAGE.confrontation);
  });

  // Endings
  document.getElementById('mercy-btn')?.addEventListener('click', () => {
    state.phase = 'GAMEOVER';
    addToLog(NARRATIVE.GAME_OVER.text);
  });

  document.getElementById('ruthless-btn')?.addEventListener('click', () => {
    state.phase = 'ENDING';
    addToLog("The child crossed herself and cried out so loud the neighbours heard her.");
    addToLog(NARRATIVE.ENDING.text);
  });

  // Global UI
  document.getElementById('inventory-toggle')?.addEventListener('click', () => {
    state.inventoryOpen = true;
    render();
  });

  document.getElementById('inventory-close')?.addEventListener('click', () => {
    state.inventoryOpen = false;
    render();
  });

  document.getElementById('restart-btn')?.addEventListener('click', () => {
    state = {
      phase: 'INTRO',
      inventory: [],
      distance: 1,
      log: [],
      waiting: false,
      cottageStep: 0,
      inventoryOpen: false
    };
    render();
  });
}

// Initial Boot
render();
