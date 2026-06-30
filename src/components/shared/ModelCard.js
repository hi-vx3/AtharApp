import React from 'react';
import { Tilt } from 'react-tilt';
import { motion } from 'framer-motion';

const defaultOptions = {
	reverse:        false,  // reverse the tilt direction
	max:            15,     // max tilt rotation (degrees)
	perspective:    1000,   // Transform perspective, the lower the more extreme the tilt gets.
	scale:          1.02,    // 2 = 200%, 1.5 = 150%, etc.
	speed:          1000,   // Speed of the enter/exit transition
	transition:     true,   // Set a transition on enter/exit.
	axis:           null,   // What axis should be disabled. Can be X or Y.
	reset:          true,    // If the tilt effect has to be reset on exit.
	easing:         "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
}

const ModelCard = ({ icon, title, description, iconBg, iconColor }) => {
    return (
        <Tilt options={defaultOptions}>
            <motion.div
                className="relative w-full h-[220px] rounded-3xl bg-slate-900/40 border border-slate-800/80 shadow-2xl shadow-black/40 p-6 flex flex-col justify-between overflow-hidden"
            >
                {/* Inner Glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent opacity-50"></div>
                </div>
                
                <div className="flex-grow"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border border-white/10"
                            style={{ backgroundColor: iconBg, color: iconColor }}
                        >
                            {icon}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">{title}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Tilt>
    );
};

export default ModelCard;