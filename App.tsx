import React, { useState, useEffect, useRef } from 'react';
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
  Wind
} from 'lucide-react';
import { GameState, Item, ActionType, Choice } from './types';
import { NARRATIVE } from './constants';
import Inventory from './components/Inventory';

const AVAILABLE_ITEMS: Item[] = [
  {
    id: 'oatcakes',
    name: "Oatcakes",
    description: "Baked on the hearthstone.",
    icon: "🍪"
  },
  {
    id: 'butter',
    name: "Pot of Butter",
    description: "A fatty offering.",
    icon: "🏺"
  },
  {
    id: 'knife',
    name: "Father's Knife",
    description: "Iron. Rusted. Sharp.",
    icon: "🗡️"
  }
];

const INITIAL_STATE: GameState = {
  phase: 'INTRO',
  inventory: [],
  distance: 1,
  claimedItems: [],
  isLoadingNarrative: false
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [narrativeLog, setNarrativeLog] = useState<string[]>([]);
  const [waitingForNextMile, setWaitingForNextMile] = useState(false);
  const [cottageStep, setCottageStep] = useState<number>(0); // 0: Enter, 1: Reveal, 2: Confront
  
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom of log
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [narrativeLog, gameState.phase, waitingForNextMile, cottageStep]);

  const addToLog = (text: string) => {
    setNarrativeLog(prev => [...prev, text]);
  };

  const handleAction = async (action: ActionType, payload?: any) => {
    let nextState = { ...gameState };
    
    switch (action) {
      case ActionType.START_GAME:
        nextState.phase = 'HOME';
        setNarrativeLog([NARRATIVE.HOME.description, NARRATIVE.HOME.mother]);
        break;

      case ActionType.COLLECT_ITEM:
        const item = payload as Item;
        if (!nextState.inventory.find(i => i.id === item.id)) {
          nextState.inventory = [...nextState.inventory, item];
          addToLog(`You pick up the ${item.name}.`);
        }
        break;

      case ActionType.LEAVE_HOME:
        nextState.phase = 'WOODS_CHOICE';
        nextState.distance = 1;
        addToLog(NARRATIVE.WOODS_EVENTS[0].text);
        break;

      case ActionType.MAKE_CHOICE:
        const choice = payload as Choice;
        setGameState(prev => ({ ...prev, isLoadingNarrative: true }));
        
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const outcome = choice.fallbackText;
        addToLog(outcome);
        setWaitingForNextMile(true);
        setGameState({ ...nextState, isLoadingNarrative: false });
        return;

      case ActionType.ATTACK_SLASH:
        addToLog("You swipe at the beast. It goes for your throat.");
        break;

      case ActionType.ATTACK_KICK:
        addToLog("You keep your footing in the deep snow.");
        break;

      case ActionType.STRIKE_LIMB:
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
        
      case ActionType.UNWRAP_HAND: 
        addToLog(NARRATIVE.COTTAGE.intro);
        nextState.phase = 'COTTAGE';
        setCottageStep(0);
        break;

      case ActionType.CHOICE_MERCY:
        nextState.phase = 'GAME_OVER';
        addToLog(NARRATIVE.GAME_OVER.text);
        break;

      case ActionType.CHOICE_RUTHLESS:
        nextState.phase = 'ENDING';
        addToLog("The child crossed herself and cried out so loud the neighbours heard her.");
        addToLog(NARRATIVE.ENDING.text);
        break;
      
      case ActionType.CLAIM_ITEM:
        if (!nextState.claimedItems.includes(payload)) {
          nextState.claimedItems = [...nextState.claimedItems, payload];
          addToLog(`You claimed the ${payload}.`);
        }
        break;

      case ActionType.RESTART:
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

  const examineItem = (item: Item) => {
    addToLog(`You look at the ${item.name}. ${item.description}`);
  };

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in px-4">
      <h1 className="text-5xl md:text-8xl font-serif text-blood tracking-tighter">THE WEREWOLF</h1>
      <h2 className="text-xl md:text-2xl text-slate-500 font-serif italic">Iron & Snow</h2>
      <p className="text-lg text-slate-400 max-w-lg leading-relaxed font-serif">
        "{NARRATIVE.INTRO.description}"
      </p>
      <button 
        onClick={() => handleAction(ActionType.START_GAME)}
        className="px-8 py-3 bg-slate-200 text-black font-bold uppercase tracking-widest hover:bg-white hover:scale-105 transition-all"
      >
        Begin Story
      </button>
    </div>
  );

  const renderScene = () => {
    return (
      <div className="flex flex-col h-full max-w-2xl mx-auto p-4 relative">
        <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-2 relative">
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
             <div className="space-y-4">
               <p className="text-sm text-slate-500 font-mono uppercase tracking-widest text-center">Collect your supplies</p>
               <div className="flex justify-center gap-4">
                 {AVAILABLE_ITEMS.map(item => {
                   const isCollected = gameState.inventory.find(i => i.id === item.id);
                   return (
                     <button
                       key={item.id}
                       disabled={!!isCollected}
                       onClick={() => handleAction(ActionType.COLLECT_ITEM, item)}
                       className={`p-4 border rounded transition-all flex flex-col items-center gap-2 ${isCollected ? 'border-slate-800 text-slate-700 opacity-50' : 'border-slate-500 hover:bg-slate-800 hover:border-slate-300'}`}
                     >
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-xs font-bold">{item.name}</span>
                     </button>
                   );
                 })}
               </div>
               {gameState.inventory.length === AVAILABLE_ITEMS.length && (
                  <button onClick={() => handleAction(ActionType.LEAVE_HOME)} className="w-full action-btn mt-4 animate-bounce">
                    <DoorOpen className="w-5 h-5" /> Open the Door
                  </button>
               )}
             </div>
          )}

          {gameState.phase === 'WOODS_CHOICE' && (
            <div className="space-y-4">
              {!waitingForNextMile ? (
                <>
                  <p className="text-sm text-slate-500 font-mono uppercase tracking-widest text-center">
                    Mile {gameState.distance} of 5
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {NARRATIVE.WOODS_EVENTS[gameState.distance - 1].choices.map(choice => (
                      <button 
                        key={choice.id}
                        onClick={() => handleAction(ActionType.MAKE_CHOICE, choice)}
                        disabled={gameState.isLoadingNarrative}
                        className="p-4 border border-slate-600 hover:bg-slate-800 hover:border-slate-400 text-left group transition-all"
                      >
                        <span className="block font-bold text-slate-200 group-hover:text-white mb-1">
                          {choice.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <button onClick={advanceMile} className="w-full action-btn">
                   <Footprints className="w-5 h-5" /> Trudge On
                </button>
              )}
            </div>
          )}

          {gameState.phase === 'AMBUSH' && (
            <div className="space-y-4 animate-pulse">
               <p className="text-red-500 font-bold text-center tracking-widest">THE BEAST IS UPON YOU</p>
               <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleAction(ActionType.ATTACK_SLASH)} className="action-btn bg-blood/20 hover:bg-blood/40 border-blood/50">
                    <Sword className="w-5 h-5" /> Swipe
                  </button>
                  <button onClick={() => handleAction(ActionType.ATTACK_KICK)} className="action-btn bg-blood/20 hover:bg-blood/40 border-blood/50">
                    <ShieldAlert className="w-5 h-5" /> Stance
                  </button>
               </div>
               <button onClick={() => handleAction(ActionType.STRIKE_LIMB)} className="w-full py-4 text-xl font-black bg-blood hover:bg-red-600 text-white border-2 border-white uppercase tracking-widest flex items-center justify-center gap-4 transition-transform hover:scale-105 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                 <Crosshair className="w-6 h-6" /> Slash the Right Forepaw
               </button>
            </div>
          )}

          {gameState.phase === 'TRANSFORMATION' && (
            <div className="text-center">
               <p className="mb-4 text-slate-400 font-serif">The snow falls thickly. The path is obscured.</p>
               <button onClick={() => handleAction(ActionType.UNWRAP_HAND)} className="action-btn animate-bounce w-full">
                 <Home className="w-5 h-5" /> Arrive at Cottage
               </button>
            </div>
          )}

          {gameState.phase === 'COTTAGE' && (
            <div className="space-y-4">
              {cottageStep === 0 && (
                <button onClick={handleCottageSequence} className="w-full action-btn">
                  <PackageOpen className="w-5 h-5" /> Make a Cold Compress
                </button>
              )}

              {cottageStep === 1 && (
                 <button onClick={handleCottageSequence} className="w-full action-btn bg-red-900/50 hover:bg-red-900 border-red-800">
                    <Eye className="w-5 h-5" /> Check the Grandmother
                 </button>
              )}

              {cottageStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
                  <button onClick={() => handleAction(ActionType.CHOICE_MERCY)} className="p-4 border border-slate-500 text-slate-400 hover:bg-slate-800 transition-colors flex flex-col items-center">
                     <Hand className="w-8 h-8 mb-2" />
                     <span className="uppercase tracking-widest text-sm">Comfort Her</span>
                     <span className="text-xs mt-1 text-slate-600">She is your kin</span>
                  </button>
                  
                  <button 
                    onClick={() => handleAction(ActionType.CHOICE_RUTHLESS)} 
                    className="p-4 border-2 border-blood bg-blood/10 text-blood hover:bg-blood hover:text-white flex flex-col items-center transition-all group"
                  >
                     <Megaphone className="w-8 h-8 mb-2" />
                     <span className="uppercase tracking-widest text-sm font-bold">Call the Neighbours</span>
                     <span className="text-xs mt-1 text-red-400/80 group-hover:text-white">Cross yourself and cry out</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {gameState.phase === 'ENDING' && (
            <div className="space-y-6">
              <div className="flex justify-center gap-4">
                {['The Teapot', 'The Mirror', 'The House'].map(item => (
                  <button 
                    key={item}
                    disabled={gameState.claimedItems.includes(item)}
                    onClick={() => handleAction(ActionType.CLAIM_ITEM, item)}
                    className={`p-2 text-sm border ${gameState.claimedItems.includes(item) ? 'bg-slate-700 text-slate-500 border-transparent' : 'border-slate-500 text-slate-300 hover:bg-slate-800'}`}
                  >
                    {gameState.claimedItems.includes(item) ? "Prospering" : `Claim ${item}`}
                  </button>
                ))}
              </div>
              {gameState.claimedItems.length === 3 && (
                <div className="text-center animate-fade-in space-y-4">
                  <h2 className="text-3xl font-serif text-white">She Prospered.</h2>
                  <button onClick={() => handleAction(ActionType.RESTART)} className="text-slate-500 hover:text-white flex items-center justify-center gap-2 mx-auto pt-4 border-t border-slate-800">
                    <RotateCcw className="w-4 h-4" /> Reincarnate
                  </button>
                </div>
              )}
            </div>
          )}

          {gameState.phase === 'GAME_OVER' && (
            <div className="text-center space-y-6">
              <h2 className="text-4xl font-serif text-blood">GAME OVER</h2>
              <p className="text-slate-400">Nature has no mercy for the warm-hearted.</p>
              <button onClick={() => handleAction(ActionType.RESTART)} className="action-btn mx-auto">
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
            </div>
          )}
          
          <div className="flex justify-center mt-2 pt-2 border-t border-slate-800">
             {gameState.phase !== 'INTRO' && (
                <span className="text-xs text-slate-700 font-mono">
                  {gameState.phase}
                </span>
             )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black h-screen w-full text-slate-200 font-sans selection:bg-red-900 selection:text-white overflow-hidden relative">
      {gameState.phase === 'INTRO' ? (
        renderIntro()
      ) : (
        renderScene()
      )}

      {gameState.phase !== 'INTRO' && (
        <Inventory 
          items={gameState.inventory} 
          isOpen={isInventoryOpen} 
          setIsOpen={setIsInventoryOpen}
          onExamine={examineItem}
        />
      )}

      <style>{`
        .action-btn {
          @apply py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-all text-sm;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
