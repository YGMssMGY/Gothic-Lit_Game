/**
 * IRON & SNOW: THE WEREWOLF
 * Vanilla JavaScript Implementation
 */

// --- CONSTANTS ---

var REVEAL_DELAY_MS = 1200; // Delay for dramatic reveal effect in cottage scene

// --- DATA ---

const NARRATIVE = {
  INTRO: {
    title: "THE WEREWOLF",
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
    description: "It is a huge wolf, with red eyes and running, grizzled chops."
  },
  TRANSFORMATION: {
    text: "The wolf let out a gulp, almost a sob. It went lolloping off on three legs, leaving a trail of blood. You wipe the blade on your apron.",
    prompt: "You wrap the wolf's paw in the cloth in which your mother had packed the oatcakes and go on towards grandmother's house."
  },
  COTTAGE: {
    intro: "Grandmother is so sick she has taken to her bed, moaning and shaking with fever.",
    dialogue: "You shake out the cloth from her basket to make her a cold compress...",
    reveal: "...and the wolf's paw falls to the floor. But it is no longer a wolf's paw. It is a hand, chopped off at the wrist, toughened with work. There is a wedding ring on the finger.",
    confrontation: "You pull back the sheet. The old woman wakes up, squawking like a thing possessed. There is a bloody stump where her right hand should have been."
  },
  ENDING: {
    title: "SHE PROSPERED",
    text: "The neighbours knew the wart on the hand at once for a witch's nipple. They drove the old woman out into the snow and pelted her until she fell down dead. Now you live in her house; you prosper."
  },
  GAMEOVER: {
    title: "THE TRAP",
    text: "You tried to be kind in a cruel world. But while you slept, grandmother returned to wolf and finished what she started."
  }
};

const ITEMS = [
  { id: 'oatcakes', name: 'Oatcakes', icon: '🍪', desc: 'Baked on the hearthstone.' },
  { id: 'butter', name: 'Pot of Butter', icon: '🏺', desc: 'A fatty offering.' },
  { id: 'knife', name: "Father's Knife", icon: '🗡️', desc: 'Iron. Rusted. Sharp.' }
];

// --- STATE ---

let state = {
  phase: 'INTRO', // INTRO, HOME, WOODS, AMBUSH, TRANSFORMATION, COTTAGE, ENDING, GAMEOVER
  inventory: [],
  distance: 1,
  log: [],
  waiting: false,
  cottageStep: 0,
  inventoryOpen: false,
  claimedItems: []
};

// --- CORE ENGINE ---

function render() {
  const root = document.getElementById('root');
  if (!root) return;

  if (state.phase === 'INTRO') {
    root.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in-up">
        <h1 class="text-6xl md:text-9xl font-serif text-blood tracking-tighter mb-2">THE WEREWOLF</h1>
        <h2 class="text-xl md:text-2xl text-gray-500 font-serif italic mb-12">IRON & SNOW</h2>
        <p class="text-gray-400 max-w-lg leading-relaxed font-serif mb-12 italic">
          "${NARRATIVE.INTRO.description}"
        </p>
        <button id="start-btn" class="px-12 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-all">
          Begin the Journey
        </button>
      </div>
    `;
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', function() {
        state.phase = 'HOME';
        state.log = [NARRATIVE.HOME.description, NARRATIVE.HOME.mother];
        render();
      });
    }
    return;
  }

  root.innerHTML = `
    <div class="flex flex-col h-full max-w-2xl mx-auto p-4 md:p-8">
      <!-- Narrative Log -->
      <div id="narrative-log" class="flex-1 overflow-y-auto space-y-6 mb-8 pr-4 relative scroll-smooth">
        ${state.log.map(function(text) { return `
          <div class="text-lg font-serif leading-relaxed text-gray-300 border-l-2 border-gray-800 pl-6 py-1 animate-fade-in-up">
            ${text}
          </div>
        `; }).join('')}
        <div id="log-end"></div>
      </div>

      <!-- Interaction Area -->
      <div class="bg-charcoal/80 border border-gray-800 rounded p-6 min-h-[220px] flex flex-col justify-center shadow-2xl">
        ${renderInteraction()}
      </div>

      <!-- Inventory Button -->
      <button id="inv-toggle" class="fixed bottom-6 right-6 p-4 bg-gray-900 border border-gray-700 text-gray-400 rounded-full hover:text-white transition-all shadow-xl z-30" aria-label="Open inventory" role="button">
        <i data-lucide="backpack"></i>
      </button>

      <!-- Inventory Modal -->
      ${state.inventoryOpen ? renderInventoryModal() : ''}
    </div>
  `;

  // Initialize Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Auto-scroll log
  const logEl = document.getElementById('narrative-log');
  if (logEl) logEl.scrollTop = logEl.scrollHeight;

  attachEvents();
}

function renderInteraction() {
  switch (state.phase) {
    case 'HOME':
      return `
        <div class="text-center space-y-6">
          <p class="text-xs uppercase tracking-widest text-gray-500">Prepare your basket</p>
          <div class="flex justify-center gap-4">
            ${ITEMS.map(function(item) {
              const collected = state.inventory.find(function(i) { return i.id === item.id; });
              return `
                <button data-collect="${item.id}" class="flex flex-col items-center p-4 border rounded transition-all ${collected ? 'opacity-20 border-gray-800 grayscale' : 'border-gray-700 hover:border-gray-300'}" ${collected ? 'disabled' : ''}>
                  <span class="text-3xl mb-1">${item.icon}</span>
                  <span class="text-[10px] font-bold uppercase">${item.name}</span>
                </button>
              `;
            }).join('')}
          </div>
          ${state.inventory.length === 3 ? `
            <button id="leave-home" class="w-full py-4 action-primary rounded animate-pulse flex items-center justify-center gap-2">
              <i data-lucide="door-open" class="w-5 h-5"></i> Open the Door
            </button>
          ` : ''}
        </div>
      `;

    case 'WOODS':
      if (state.waiting) {
        return `
          <button id="next-mile" class="w-full py-6 action-primary rounded flex items-center justify-center gap-2 text-lg">
            <i data-lucide="footprints" class="w-6 h-6"></i> Trudge Deeper into the Cold
          </button>
        `;
      }
      var event = NARRATIVE.WOODS_EVENTS[state.distance - 1];
      return `
        <div class="space-y-4">
          <p class="text-center text-[10px] text-gray-500 uppercase tracking-widest">Mile ${state.distance} of 5</p>
          <div class="grid grid-cols-1 gap-2">
            ${event.choices.map(function(c) { return `
              <button data-choice="${c.id}" class="choice-btn w-full p-4 text-left rounded text-sm font-bold text-gray-300 hover:text-white">
                ${c.text}
              </button>
            `; }).join('')}
          </div>
        </div>
      `;

    case 'AMBUSH':
      return `
        <div class="text-center space-y-6">
          <p class="text-red-600 font-bold tracking-widest animate-pulse">A BEAST EMERGES FROM THE SNOW</p>
          <button id="strike-wolf" class="w-full py-8 action-primary border-4 border-white text-2xl shadow-[0_0_20px_rgba(138,11,11,0.5)]">
            SLASH THE RIGHT FOREPAW
          </button>
        </div>
      `;

    case 'TRANSFORMATION':
      return `
        <button id="go-cottage" class="w-full py-6 action-primary rounded text-lg">
          Seek your Grandmother's Shelter
        </button>
      `;

    case 'COTTAGE':
      if (state.cottageStep === 0) {
        return `<button id="do-compress" class="w-full py-6 action-primary rounded">Make a Cold Compress</button>`;
      }
      if (state.cottageStep === 1) {
        return `<button id="check-bed" class="w-full py-6 action-primary rounded bg-red-900 border-2 border-white">Check the Bedding</button>`;
      }
      return `
        <div class="grid grid-cols-2 gap-4">
          <button id="ending-mercy" class="p-4 border border-gray-700 text-gray-500 hover:text-white font-bold uppercase text-xs">Comfort Her</button>
          <button id="ending-ruthless" class="p-4 action-primary text-xs">Call the Neighbours</button>
        </div>
      `;

    case 'ENDING':
      return `
        <div class="text-center space-y-6">
          <h2 class="text-3xl font-serif text-white uppercase tracking-widest">She Prospered</h2>
          <div class="flex justify-center gap-2">
            ${['Teapot', 'Mirror', 'House'].map(function(it) { return `
              <button data-claim="${it}" class="px-4 py-2 border border-gray-600 text-[10px] uppercase font-bold ${state.claimedItems.includes(it) ? 'bg-gray-800 text-gray-500 line-through' : 'hover:border-white'}">
                Claim ${it}
              </button>
            `; }).join('')}
          </div>
          ${state.claimedItems.length === 3 ? `
            <button id="restart-game" class="text-gray-600 hover:text-white text-xs underline mt-4">Begin a New Life</button>
          ` : ''}
        </div>
      `;

    case 'GAMEOVER':
      return `
        <div class="text-center space-y-4">
          <h2 class="text-3xl font-serif text-blood">THE TRAP</h2>
          <p class="text-gray-500 text-sm italic">Kindness is a luxury the mountains do not afford.</p>
          <button id="restart-game" class="px-8 py-3 action-primary mt-4">Try Again</button>
        </div>
      `;

    default: return '';
  }
}

function renderInventoryModal() {
  return `
    <div class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="inventory-title">
      <div class="bg-charcoal border-2 border-blood w-full max-w-sm p-8 relative shadow-2xl">
        <button id="inv-close" class="absolute top-4 right-4 text-gray-500 hover:text-white" aria-label="Close inventory">
          <i data-lucide="x"></i>
        </button>
        <h3 id="inventory-title" class="text-blood font-serif text-2xl border-b border-gray-800 pb-2 mb-6 tracking-widest uppercase">The Basket</h3>
        <div class="space-y-4">
          ${state.inventory.length === 0 ? '<p class="text-gray-600 italic">It is empty.</p>' : ''}
          ${state.inventory.map(function(item) { return `
            <div class="flex items-center gap-4 p-3 border border-gray-800 bg-black/40">
              <span class="text-3xl">${item.icon}</span>
              <div>
                <p class="font-bold text-gray-200 text-sm uppercase">${item.name}</p>
                <p class="text-[10px] text-gray-500 font-serif">${item.desc || ''}</p>
              </div>
            </div>
          `; }).join('')}
        </div>
      </div>
    </div>
  `;
}

// --- EVENT HANDLERS ---

function attachEvents() {
  // Collection
  document.querySelectorAll('[data-collect]').forEach(function(btn) {
    btn.onclick = function() {
      var id = btn.dataset.collect;
      var item = ITEMS.find(function(i) { return i.id === id; });
      if (item) {
        state.inventory.push(item);
        state.log.push('You placed the ' + item.name + ' in your basket.');
        render();
      }
    };
  });

  // Home Phase
  var leaveHome = document.getElementById('leave-home');
  if (leaveHome) leaveHome.onclick = function() {
    state.phase = 'WOODS';
    state.distance = 1;
    state.log.push(NARRATIVE.WOODS_EVENTS[0].text);
    render();
  };

  // Woods Choices
  document.querySelectorAll('[data-choice]').forEach(function(btn) {
    btn.onclick = function() {
      var id = btn.dataset.choice;
      var event = NARRATIVE.WOODS_EVENTS[state.distance - 1];
      var choice = event.choices.find(function(c) { return c.id === id; });
      if (choice) {
        state.log.push(choice.outcome);
        state.waiting = true;
        render();
      }
    };
  });

  // Next Mile
  var nextMile = document.getElementById('next-mile');
  if (nextMile) nextMile.onclick = function() {
    state.waiting = false;
    state.distance++;
    if (state.distance > 4) {
      state.phase = 'AMBUSH';
      state.inventory = state.inventory.filter(function(i) { return i.id === 'knife'; }); // Lose gifts
      state.log.push(NARRATIVE.AMBUSH.intro);
      state.log.push(NARRATIVE.AMBUSH.description);
      state.log.push("You dropped your gifts. You hold only the knife.");
    } else {
      state.log.push(NARRATIVE.WOODS_EVENTS[state.distance - 1].text);
    }
    render();
  };

  // Ambush
  var strikeWolf = document.getElementById('strike-wolf');
  if (strikeWolf) strikeWolf.onclick = function() {
    state.phase = 'TRANSFORMATION';
    state.inventory.push({ id: 'paw', name: "The Wolf's Paw", icon: '🐾', desc: 'Wrapped in a bloody cloth.' });
    state.log.push(NARRATIVE.TRANSFORMATION.text);
    state.log.push(NARRATIVE.TRANSFORMATION.prompt);
    render();
  };

  // Arrival
  var goCottage = document.getElementById('go-cottage');
  if (goCottage) goCottage.onclick = function() {
    state.phase = 'COTTAGE';
    state.cottageStep = 0;
    state.log.push(NARRATIVE.COTTAGE.intro);
    render();
  };

  // Cottage Sequence
  var doCompress = document.getElementById('do-compress');
  if (doCompress) doCompress.onclick = function() {
    state.log.push(NARRATIVE.COTTAGE.dialogue);
    setTimeout(function() {
      state.cottageStep = 1;
      state.inventory = state.inventory.map(function(i) {
        return i.id === 'paw' ? { id: i.id, name: 'A Severed Hand', icon: '🖐️', desc: 'A wedding ring on the finger.' } : i;
      });
      state.log.push(NARRATIVE.COTTAGE.reveal);
      render();
    }, REVEAL_DELAY_MS);
  };

  var checkBed = document.getElementById('check-bed');
  if (checkBed) checkBed.onclick = function() {
    state.cottageStep = 2;
    state.log.push(NARRATIVE.COTTAGE.confrontation);
    render();
  };

  // Endings
  var mercy = document.getElementById('ending-mercy');
  if (mercy) mercy.onclick = function() {
    state.phase = 'GAMEOVER';
    state.log.push(NARRATIVE.GAMEOVER.text);
    render();
  };

  var ruthless = document.getElementById('ending-ruthless');
  if (ruthless) ruthless.onclick = function() {
    state.phase = 'ENDING';
    state.log.push("The child crossed herself and cried out so loud the neighbours heard her.");
    state.log.push(NARRATIVE.ENDING.text);
    render();
  };

  // Claim items in ending
  document.querySelectorAll('[data-claim]').forEach(function(btn) {
    btn.onclick = function() {
      var item = btn.dataset.claim;
      if (item && !state.claimedItems.includes(item)) {
        state.claimedItems.push(item);
        state.log.push('You claimed the ' + item + '.');
        render();
      }
    };
  });

  // UI Toggles
  var invToggle = document.getElementById('inv-toggle');
  if (invToggle) invToggle.onclick = function() {
    state.inventoryOpen = true;
    render();
  };

  var invClose = document.getElementById('inv-close');
  if (invClose) invClose.onclick = function() {
    state.inventoryOpen = false;
    render();
  };

  var restart = document.getElementById('restart-game');
  if (restart) restart.onclick = function() {
    state = {
      phase: 'INTRO',
      inventory: [],
      distance: 1,
      log: [],
      waiting: false,
      cottageStep: 0,
      inventoryOpen: false,
      claimedItems: []
    };
    render();
  };
}

// Initial Boot - Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  render();
});
