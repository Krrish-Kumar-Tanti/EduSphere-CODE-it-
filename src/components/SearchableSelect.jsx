import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, Building2 } from 'lucide-react';

export default function SearchableSelect({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select or search...",
  icon: Icon = Building2,
  isCollegeList = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState('bottom'); // 'bottom' | 'top'
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Viewport collision detection
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 260 && rect.top > 260) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  const filtered = options.filter(opt => {
    const text = isCollegeList ? `${opt.name} ${opt.code} ${opt.location}` : opt;
    return text?.toLowerCase().includes(search.toLowerCase());
  });

  const getDisplayValue = () => {
    if (!value) return placeholder;
    if (isCollegeList) {
      const found = options.find(o => o.name === value || o.code === value);
      return found ? found.name : value;
    }
    return value;
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 mb-1">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-left text-xs font-semibold text-slate-800 flex items-center justify-between hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
      >
        <div className="flex items-center gap-2 truncate">
          <Icon className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span className={`truncate ${value ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
            {getDisplayValue()}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu with Collision Aware Top/Bottom Positioning */}
      {isOpen && (
        <div 
          className={`absolute left-0 right-0 z-50 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-56 flex flex-col animate-fadeIn ${
            dropdownPosition === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          }`}
        >
          {/* Search Box inside dropdown */}
          <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2 sticky top-0 z-10">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type to filter..."
              className="w-full bg-transparent text-xs text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
            />
            {search && (
              <button 
                type="button" 
                onClick={() => setSearch('')}
                className="text-[10px] text-slate-400 hover:text-slate-600 font-bold px-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Options List with Smooth Scroll */}
          <div className="overflow-y-auto p-1.5 space-y-1 max-h-44 scrollbar-thin scrollbar-thumb-slate-200">
            {filtered.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400">
                No matching options found.
              </div>
            ) : (
              filtered.map((item, idx) => {
                const itemValue = isCollegeList ? item.name : item;
                const isSelected = value === itemValue;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      onChange(itemValue);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer text-xs transition flex items-start justify-between gap-2 ${
                      isSelected 
                        ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200' 
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        {isCollegeList && (
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 font-bold border border-slate-200">
                            Code {item.code}
                          </span>
                        )}
                        <span className="font-semibold text-slate-800">
                          {isCollegeList ? item.name : item}
                        </span>
                      </div>
                      {isCollegeList && item.location && (
                        <p className="text-[10px] text-slate-500 mt-0.5 pl-0.5">
                          {item.location} • {item.type}
                        </p>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />}
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}
    </div>
  );
}

