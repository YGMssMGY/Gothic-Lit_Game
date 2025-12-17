import React, { useState } from 'react';
import { Item } from '../types';
import { Backpack, X } from 'lucide-react';

interface Props {
  items: Item[];
  onExamine: (item: Item) => void;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

const Inventory: React.FC<Props> = ({ items, onExamine, isOpen, setIsOpen }) => {
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-4 bg-charcoal border-2 border-slate-600 text-slate-200 hover:bg-slate-800 transition-colors z-40 rounded-full shadow-lg"
      >
        <Backpack className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-charcoal border-2 border-blood w-full max-w-md p-6 relative shadow-[0_0_50px_rgba(138,11,11,0.3)]">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="font-serif text-2xl text-blood mb-6 tracking-widest uppercase border-b border-slate-700 pb-2">
          Basket Contents
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {items.length === 0 && <p className="text-slate-500 italic">Your basket is empty.</p>}
          {items.map((item) => (
            <div 
              key={item.id}
              onClick={() => onExamine(item)}
              className="group cursor-pointer border border-slate-700 p-4 hover:bg-slate-900 transition-all hover:border-slate-400 flex flex-col items-center text-center"
            >
              <div className="text-4xl mb-2 transition-transform group-hover:scale-110 duration-500">
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wide">{item.name}</h3>
              <p className="text-xs text-slate-500 mt-2 font-serif">{item.description}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500 mt-6 text-center font-mono">
          Click an item to examine it closely.
        </p>
      </div>
    </div>
  );
};

export default Inventory;
