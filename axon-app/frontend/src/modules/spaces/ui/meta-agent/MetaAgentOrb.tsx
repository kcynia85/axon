import React from 'react';
import { motion } from 'framer-motion';
import { MagicSphere } from "@/shared/ui/complex/MagicSphere";
import { cn } from "@/shared/lib/utils";

interface MetaAgentOrbProps {
    onClick: () => void;
    isOpen: boolean;
}

export const MetaAgentOrb: React.FC<MetaAgentOrbProps> = ({ onClick, isOpen }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={cn(
                "fixed bottom-8 right-8 z-[900] w-16 h-16 rounded-full flex items-center justify-center transition-opacity",
                isOpen ? " pointer-events-none" : "0 hover:"
            )}
        >
            <div className="absolute inset-0 flex items-center justify-center scale-[0.5] origin-center pointer-events-none">
                <MagicSphere />
            </div>
        </motion.button>
    );
};
