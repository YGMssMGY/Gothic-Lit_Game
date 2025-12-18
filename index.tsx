import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Sword, 
  Footprints, 
  Hand, 
  Skull, 
  RotateCcw, 
  PackageOpen,
  Crosshair,
  Home,
  ShieldAlert,
  DoorOpen,
  Eye,
  Megaphone,
  Wind,
  Backpack,
  X
} from 'lucide-react';

// --- TYPES ---

type GamePhase = 
  | 'INTRO'
  | 'HOME'
  | 'WOODS_CHOICE'
  | 'AMBUSH'
  | 'TRANSFORMATION'
  | 'COTTAGE'
  | 'GAME_OVER'
  | 'ENDING';

interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  isTransformed?: boolean;
}

interface Choice {
  id: string;
  text: string;
  fallbackText: string;
}

interface GameState {
  phase: GamePhase;
  inventory: Item[];
  distance: number;
  claimedItems: string[]; 
  isLoadingNarrative: boolean;
}

// --- CONSTANTS ---

const NARRATIVE = {
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
        { id: 'pray', text: "Place a votive offering", fallbackText: "You leave a small loaf. The bears will lumber from the margins to snatch it away." },
        { id: 'devil', text: "Look for the Devil", fallbackText: "They say at midnight the Devil holds picnics here and invites the witches to eat fresh corpses." },
        { id: 'ignore', text: "Walk past", fallbackText: "You keep walking. The cold wind bites." }
      ]
    },
    {
      mile: 2,
      text: "The path narrows. The trees close in. You hear a rustling in the undergrowth.",
      choices: [
        { id: 'hide', text: "Hide in the snow", fallbackText: "You crouch in the snow. Innocence is no protection here." },
        { id: 'knife', text: "Draw your knife", fallbackText: "You grip the handle of your father's knife. You know how to use it." }
      ]
    },
    {
      mile: 3,
      text: "You see a wreath of garlic on a tree stump, fallen from a woodcutter's door.",
      choices: [
        { id: 'take', text: "Kick it aside", fallbackText: "You kick the wreath. Garlic keeps out the vampires, they say." },
        { id: 'examine', text: "Check for tracks", fallbackText: "You ignore the charm. You scan the snow for the spoor of beasts." }
      ]
    },
    {
      mile: 4,
      text: "The snow begins to fall thickly. The path is obscured.",
      choices: [
        { id: 'shiver', text: "Pull your sheepskin tight", fallbackText: "Your scabby coat of sheepskin keeps out the cold, but barely." },
        { id: 'harden', text: "Embrace the freeze", fallbackText: "You are a mountaineer's child. You do not die of fright." }
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
    reveal: "...and the wolf's paw falls to the floor. But it is no longer a wolf's paw. It is a hand, chopped off at the wrist, toughened with work and freckled with old age. There is a wedding ring on the third finger.",
    confrontation: "You pull back the sheet. The old woman wakes up, squawking and shrieking like a thing possessed. But the child is strong, and armed with her father's hunting knife. There is a bloody stump where her right hand should have been, festering already."
  },
  GAME_OVER: {
    title: "The Fairy Tale Trap",
    text: "You tried to be kind in a cruel world. But this is not that kind of story. While you slept, grandmother returned to wolf!"
  },
  ENDING: {
    title: "She Prospered",
    text: "The neighbours knew the wart on the hand at once for a witch's nipple. They drove the old woman out into the snow with sticks, and pelted her with stones until she fell down dead. Now you live in her house; you prosper."
  }
};

const AVAILABLE_ITEMS: Item[] = [
  { id: 'oatcakes', name: "Oatcakes", description: "Baked on the hearthstone.", icon: "🍪" },
  { id: 'butter', name: "Pot of Butter", description: "A fatty offering.", icon: "🏺" },
  { id: 'knife', name: "Father's Knife", description: "Iron. Rusted. Sharp.", icon: "🗡️" }
];

const INITIAL_STATE: GameState = {
  phase: 'INTRO',
  inventory: [],
  distance: 1,
  claimedItems: [],
  isLoadingNarrative: false
};

// --- COMPONENTS ---

const InventoryOverlay: React.FC<{ items: Item[], isOpen: boolean, onClose: () => void }> = ({ items, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      <div className="bg-charcoal border-2 border-blood w-full max-w-md p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        <h2 className="font-serif text-2xl text-blood mb-6 tracking-widest uppercase border-b border-slate-700 pb-2">
          Basket Contents
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {items.length === 0 && <p className="text-slate-500 italic">Your basket is empty.</p>}
          {items.map((item) => (
            <div key={item.id} className="border border-slate-700 p-4 flex flex-col items-center text-center bg-slate-900/50">
              <div className="text-4xl mb-2">{item.icon}</div>
              <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wide">{item.name}</h3>
              <p className="text-xs text-slate-500 mt-2 font-serif">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [narrativeLog, setNarrativeLog] = useState<string[]>([]);
  const [waitingForNextMile, setWaitingForNextMile] = useState(false);
  const [cottageStep, setCottageStep] = useState<number>(0);
  
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [narrativeLog, gameState.phase, waitingForNextMile, cottageStep]);

  const addToLog = (text: string) => {
    setNarrativeLog(prev => [...prev, text]);
  };

  const handleAction = async (action: string, payload?: any) => {
    let nextState = { ...gameState };
    
    switch (action) {
      case 'START_GAME':
        nextState.phase = 'HOME';
        setNarrativeLog([NARRATIVE.HOME.description, NARRATIVE.HOME.mother]);
        break;

      case 'COLLECT_ITEM':
        const item = payload as Item;
        if (!nextState.inventory.find(i => i.id === item.id)) {
          nextState.inventory = [...nextState.inventory, item];
          addToLog(`You pick up the ${item.name}.`);
        }
        break;

      case 'LEAVE_HOME':
        nextState.phase = 'WOODS_CHOICE';
        nextState.distance = 1;
        addToLog(NARRATIVE.WOODS_EVENTS[0].text);
        break;

      case 'MAKE_CHOICE':
        const choice = payload as Choice;
        setGameState(prev => ({ ...prev, isLoadingNarrative: true }));
        await new Promise(resolve => setTimeout(resolve, 600));
        addToLog(choice.fallbackText);
        setWaitingForNextMile(true);
        setGameState({ ...nextState, isLoadingNarrative: false });
        return;

      case 'STRIKE_LIMB':
        nextState.phase = 'TRANSFORMATION';
        nextState.inventory.push({
          id: 'wolf-paw',
          name: "The Wolf's Paw",
          description: "Wrapped in the cloth meant for oatcakes.",
          icon: "🐾",
          isTransformed: false
        });
        addToLog(NARRATIVE.TRANSFORMATION.text);
        addToLog(NARRATIVE.TRANSFORMATION.prompt);
        break;
        
      case 'UNWRAP_HAND': 
        addToLog(NARRATIVE.COTTAGE.intro);
        nextState.phase = 'COTTAGE';
        setCottageStep(0);
        break;

      case 'CHOICE_MERCY':
        nextState.phase = 'GAME_OVER';
        addToLog(NARRATIVE.GAME_OVER.text);
        break;

      case 'CHOICE_RUTHLESS':
        nextState.phase = 'ENDING';
        addToLog("The child crossed herself and cried out so loud the neighbours heard her.");
        addToLog(NARRATIVE.ENDING.text);
        break;
      
      case 'CLAIM_ITEM':
        if (!nextState.claimedItems.includes(payload)) {
          nextState.claimedItems = [...nextState.claimedItems, payload];
          addToLog(`You claimed the ${payload}.`);
        }
        break;

      case 'RESTART':
        setNarrativeLog([]);
        setWaitingForNextMile(false);
        setCottageStep(0);
        setGameState(INITIAL_STATE);
        return;
    }

    setGameState(nextState);
  };

  const advanceMile = () => {
    setWaitingForNextMile(false);
    setGameState(prev => {
      const newDistance = prev.distance + 1;
      if (newDistance > 4) {
        addToLog(NARRATIVE.AMBUSH.intro);
        addToLog(NARRATIVE.AMBUSH.description);
        addToLog("You dropped the oatcakes. You dropped the butter. You hold only the knife.");
        const knifeOnly = prev.inventory.filter(i => i.id === 'knife');
        return { ...prev, distance: newDistance, phase: 'AMBUSH', inventory: knifeOnly };
      } else {
        addToLog(NARRATIVE.WOODS_EVENTS[newDistance - 1].text);
        return { ...prev, distance: newDistance };
      }
    });
  };

  const handleCottageSequence = () => {
    if (cottageStep === 0) {
      addToLog(NARRATIVE.COTTAGE.dialogue);
      setTimeout(() => {
        addToLog(NARRATIVE.COTTAGE.reveal);
        setGameState(prev => ({
          ...prev,
          inventory: prev.inventory.map(i => 
            i.id === 'wolf-paw' 
              ? { 
                  ...i, 
                  name: "Hand with the Wart", 
                  description: "Toughened with work. A wedding ring on the third finger.", 
                  icon: "🖐️",
                  isTransformed: true 
                } 
              : i
          )
        }));
        setCottageStep(1);
      }, 1500);
    } else if (cottageStep === 1) {
      addToLog(NARRATIVE.COTTAGE.confrontation);
      setCottageStep(2);
    }
  };

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in px-4">
      <h1 className="text-5xl md:text-8xl font-serif text-blood tracking-tighter">THE WEREWOLF</h1>
      <h2 className="text-xl md:text-2xl text-slate-500 font-serif italic">Iron & Snow</h2>
      <p className="text-lg text-slate-400 max-w-lg leading-relaxed font-serif">
        "{NARRATIVE.INTRO.description}"
      </p>
      <button 
        onClick={() => handleAction('START_GAME')}
        className="px-8 py-3 bg-slate-200 text-black font-bold uppercase tracking-widest hover:bg-white hover:scale-105 transition-all"
      >
        Begin Story
      </button>
    </div>
  );

  const renderScene = () => (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 relative">
      <div id="narrative-log" className="flex-1 overflow-y-auto space-y-6 mb-8 pr-2 relative scroll-smooth">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Skull className="w-64 h-64" />
        </div>
        {narrativeLog.map((log, i) => (
          <p key={i} className="text-lg font-serif leading-relaxed text-slate-300 border-l-2 border-slate-800 pl-4 py-1 animate-fade-in-up">
            {log}
          </p>
        ))}
        {gameState.isLoadingNarrative && (
          <p className="text-sm font-mono text-slate-600 animate-pulse pl-4">The cold wind bites...</p>
        )}
        <div ref={logEndRef} />
      </div>

      <div className="bg-charcoal/90 border-t border-slate-700 p-6 flex flex-col gap-4 min-h-[200px]">
        {gameState.phase === 'HOME' && (
          <div className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-widest text-slate-500">Collect your supplies</p>
            <div className="flex justify-center gap-4">
              {AVAILABLE_ITEMS.map(item => {
                const isCollected = gameState.inventory.find(i => i.id === item.id);
                return (
                  <button
                    key={item.id}
                    disabled={!!isCollected}
                    onClick={() => handleAction('COLLECT_ITEM', item)}
                    className={`p-4 border rounded transition-all flex flex-col items-center gap-2 ${isCollected ? 'border-slate-800 text-slate-700 opacity-50' : 'border-slate-500 hover:bg-slate-800 hover:border-slate-300'}`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-[10px] font-bold uppercase">{item.name}</span>
                  </button>
                );
              })}
            </div>
            {gameState.inventory.length === AVAILABLE_ITEMS.length && (
              <button onClick={() => handleAction('LEAVE_HOME')} className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-slate-200 transition-all">
                Open the Door
              </button>
            )}
          </div>
        )}

        {gameState.phase === 'WOODS_CHOICE' && (
          <div className="space-y-4">
            {!waitingForNextMile ? (
              <>
                <p className="text-sm text-slate-500 font-mono uppercase tracking-widest text-center">Mile {gameState.distance} of 5</p>
                <div className="grid grid-cols-1 gap-3">
                  {NARRATIVE.WOODS_EVENTS[gameState.distance - 1].choices.map(choice => (
                    <button 
                      key={choice.id}
                      onClick={() => handleAction('MAKE_CHOICE', choice)}
                      className="p-4 border border-slate-600 hover:bg-slate-800 hover:border-slate-400 text-left font-bold transition-all"
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <button onClick={advanceMile} className="w-full py-4 bg-slate-100 text-black font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2">
                <Footprints className="w-5 h-5" /> Trudge On
              </button>
            )}
          </div>
        )}

        {gameState.phase === 'AMBUSH' && (
          <div className="space-y-4 text-center">
            <p className="text-red-500 font-bold tracking-widest animate-pulse">THE BEAST IS UPON YOU</p>
            <button onClick={() => handleAction('STRIKE_LIMB')} className="w-full py-6 text-xl font-black bg-blood hover:bg-red-600 text-white border-2 border-white uppercase tracking-widest shadow-lg transition-transform hover:scale-105">
              Slash the Right Forepaw
            </button>
          </div>
        )}

        {gameState.phase === 'TRANSFORMATION' && (
          <div className="text-center">
            <button onClick={() => handleAction('UNWRAP_HAND')} className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-slate-200">
              Arrive at Cottage
            </button>
          </div>
        )}

        {gameState.phase === 'COTTAGE' && (
          <div className="space-y-4">
            {cottageStep === 0 && (
              <button onClick={handleCottageSequence} className="w-full py-4 bg-slate-100 text-black font-bold uppercase">
                Make a Cold Compress
              </button>
            )}
            {cottageStep === 1 && (
              <button onClick={handleCottageSequence} className="w-full py-4 bg-red-900 text-white font-bold uppercase">
                Check the Grandmother
              </button>
            )}
            {cottageStep === 2 && (
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleAction('CHOICE_MERCY')} className="p-4 border border-slate-500 text-slate-400 hover:bg-slate-800 font-bold uppercase text-sm">Comfort Her</button>
                <button onClick={() => handleAction('CHOICE_RUTHLESS')} className="p-4 bg-blood text-white font-bold uppercase text-sm">Call the Neighbours</button>
              </div>
            )}
          </div>
        )}

        {gameState.phase === 'ENDING' && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center gap-4">
              {['The Teapot', 'The Mirror', 'The House'].map(item => (
                <button 
                  key={item}
                  disabled={gameState.claimedItems.includes(item)}
                  onClick={() => handleAction('CLAIM_ITEM', item)}
                  className={`px-4 py-2 text-xs border ${gameState.claimedItems.includes(item) ? 'bg-slate-700 text-slate-500 border-transparent' : 'border-slate-500 text-slate-300 hover:bg-slate-800 uppercase'}`}
                >
                  {gameState.claimedItems.includes(item) ? "Prospering" : `Claim ${item}`}
                </button>
              ))}
            </div>
            {gameState.claimedItems.length === 3 && (
              <div className="space-y-4">
                <h2 className="text-3xl font-serif text-white">She Prospered.</h2>
                <button onClick={() => handleAction('RESTART')} className="text-slate-500 hover:text-white flex items-center justify-center gap-2 mx-auto pt-4 border-t border-slate-800">
                  <RotateCcw className="w-4 h-4" /> Reincarnate
                </button>
              </div>
            )}
          </div>
        )}

        {gameState.phase === 'GAME_OVER' && (
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-serif text-blood">GAME OVER</h2>
            <p className="text-slate-400 font-serif italic">Nature has no mercy for the warm-hearted.</p>
            <button onClick={() => handleAction('RESTART')} className="px-8 py-3 bg-slate-200 text-black font-bold uppercase tracking-widest hover:bg-white transition-all mx-auto">
              Try Again
            </button>
          </div>
        )}
      </div>

      <button onClick={() => setIsInventoryOpen(true)} className="fixed bottom-6 right-6 p-4 bg-charcoal border-2 border-slate-600 text-slate-200 hover:bg-slate-800 transition-colors z-40 rounded-full shadow-lg">
        <Backpack className="w-6 h-6" />
      </button>

      <InventoryOverlay items={gameState.inventory} isOpen={isInventoryOpen} onClose={() => setIsInventoryOpen(false)} />
    </div>
  );

  return (
    <div className="bg-black h-screen w-full text-slate-200 font-sans selection:bg-red-900 selection:text-white overflow-hidden">
      {gameState.phase === 'INTRO' ? renderIntro() : renderScene()}
      <style>{`
        .animate-fade-in { animation: fadeIn 1.2s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        #narrative-log::-webkit-scrollbar { width: 3px; }
        #narrative-log::-webkit-scrollbar-track { background: transparent; }
        #narrative-log::-webkit-scrollbar-thumb { background: #333; }
      `}</style>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);