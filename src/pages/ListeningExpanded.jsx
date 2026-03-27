import React from 'react';

const ListeningExpanded = () => {
    return (
        <div className="min-h-screen bg-brand-bg text-white relative overflow-hidden pb-32">
            {/* Subtle Background Orbs */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-brand-purple rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-teal rounded-full mix-blend-screen filter blur-[150px] opacity-15"></div>

            {/* Header Setup */}
            <header className="px-6 pt-12 pb-4 z-10 relative flex items-center justify-between">
                <button className="text-gray-400 hover:text-white mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
                <h1 className="text-xl font-bold flex-1 text-center pr-6">Your Week in Review</h1>
            </header>

            <main className="px-6 space-y-6 z-10 relative mt-4">
                
                {/* Insights Section */}
                <div className="glass-panel p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">Insights</h3>
                        <span className="text-xs text-gray-400">Last 7 Days</span>
                    </div>
                    
                    <p className="text-sm text-gray-300 leading-relaxed mb-6">
                        Seriously, Sarah? 10 hours of loFi hip hop beats to study/relax to? We hope you were actually studying! Your genre distribution was 40% loFi.
                    </p>

                    <div className="flex justify-between border-b border-gray-600/30 pb-4 mb-4">
                        <div>
                            <p className="text-2xl font-bold">40%</p>
                            <p className="text-xs text-brand-teal">Productivity</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold">19</p>
                            <p className="text-xs text-gray-400">Genres</p>
                        </div>
                    </div>

                    {/* Simple Progress Bar Mocking Genre Split */}
                    <div className="w-full h-1 bg-gray-700 rounded-full flex overflow-hidden">
                        <div className="h-full bg-brand-teal w-[40%]"></div>
                        <div className="h-full bg-brand-purple w-[21%]"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                        <span>40% Lo-Fi</span>
                        <span>21% Pop</span>
                    </div>
                </div>

                {/* Daily Breakdown Bar Chart (Mocked statically) */}
                <div className="glass-panel p-5">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-lg">Daily Breakdown</h3>
                        <button className="text-xs text-gray-400 border border-gray-600 rounded px-2 py-1">Last 7 Days</button>
                    </div>

                    {/* CSS Bar Chart */}
                    <div className="h-40 flex items-end justify-between gap-2 pb-4 border-b border-gray-600/50">
                        
                        {/* Day 1 */}
                        <div className="flex flex-col items-center flex-1 gap-2 group">
                             <div className="w-full bg-brand-purple/50 group-hover:bg-brand-purple transition-colors rounded-t-sm h-[40%]"></div>
                             <span className="text-[10px] text-gray-400">M</span>
                        </div>
                        
                        {/* Day 2 */}
                        <div className="flex flex-col items-center flex-1 gap-2 group">
                             <div className="w-full bg-brand-teal rounded-t-sm h-[80%] relative">
                                  {/* Tooltip mock */}
                                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-[10px] py-1 px-2 rounded hidden group-hover:block whitespace-nowrap z-10">4.5 hrs</div>
                             </div>
                             <span className="text-[10px] text-white font-bold">T</span>
                        </div>
                        
                        {/* Day 3 */}
                        <div className="flex flex-col items-center flex-1 gap-2 group">
                             <div className="w-full bg-brand-purple/50 group-hover:bg-brand-purple transition-colors rounded-t-sm h-[30%]"></div>
                             <span className="text-[10px] text-gray-400">W</span>
                        </div>

                        {/* Day 4 */}
                        <div className="flex flex-col items-center flex-1 gap-2 group">
                             <div className="w-full bg-brand-purple/50 group-hover:bg-brand-purple transition-colors rounded-t-sm h-[50%]"></div>
                             <span className="text-[10px] text-gray-400">T</span>
                        </div>

                        {/* Day 5 */}
                        <div className="flex flex-col items-center flex-1 gap-2 group">
                             <div className="w-full bg-brand-purple/50 group-hover:bg-brand-purple transition-colors rounded-t-sm h-[70%]"></div>
                             <span className="text-[10px] text-gray-400">F</span>
                        </div>

                        {/* Day 6 */}
                        <div className="flex flex-col items-center flex-1 gap-2 group">
                             <div className="w-full bg-gray-700 group-hover:bg-gray-500 transition-colors rounded-t-sm h-[20%]"></div>
                             <span className="text-[10px] text-gray-500">S</span>
                        </div>

                        {/* Day 7 */}
                        <div className="flex flex-col items-center flex-1 gap-2 group">
                             <div className="w-full bg-gray-700 group-hover:bg-gray-500 transition-colors rounded-t-sm h-[15%]"></div>
                             <span className="text-[10px] text-gray-500">S</span>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
};

export default ListeningExpanded;
