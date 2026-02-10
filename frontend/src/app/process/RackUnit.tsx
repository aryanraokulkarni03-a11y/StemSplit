import React from 'react'

type RackUnitProps = {
  label: string
  isActive: boolean
  isComplete: boolean
  rotation: number
}

const RackUnit: React.FC<RackUnitProps> = ({ label, isActive, isComplete, rotation }) => {
  return (
    <div className="rack-unit p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 group relative">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black/50" />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black/50" />
      <div className="flex items-center gap-4 sm:gap-6 pl-4 sm:pl-6">
        <div className="w-20 sm:w-24">
          <span className="block text-xs text-[#A8977A]/60 font-mono uppercase tracking-widest mb-1">Channel</span>
          <h3 className="text-lg sm:text-xl font-bold text-[#F2E8DC] uppercase">{label}</h3>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isComplete ? 'bg-green-500' : isActive ? 'bg-amber-500' : 'bg-zinc-800'}`} />
          <span className="text-[9px] font-mono text-zinc-600 uppercase">Signal</span>
        </div>
      </div>
      <div className="relative w-32 h-16 bg-[#F2E8DC] rounded-t-lg overflow-hidden border-2 border-[#161711] shadow-inner ml-auto mr-12 opacity-90">
        <span className="absolute top-2 right-2 text-[8px] font-bold text-red-700">PEAK</span>
        <div
          className="absolute bottom-[-2px] left-1/2 w-[2px] h-14 bg-red-600 origin-bottom needle-transition z-10"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        />
        <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-20" />
      </div>
    </div>
  )
}

export default RackUnit
