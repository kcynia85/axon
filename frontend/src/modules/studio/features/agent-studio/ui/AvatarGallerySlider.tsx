"use client";

import { cn } from "@/shared/lib/utils";
import type { AvatarGallerySliderProps } from "../../types/components.types";
import { useAvatarGallerySlider } from "../application/hooks/useAvatarGallerySlider";

export const AvatarGallerySlider = (props: AvatarGallerySliderProps) => {
	const { avatars, value, onSelect } = useAvatarGallerySlider(props);

	return (
		<div className="w-full overflow-x-auto no-scrollbar py-8">
			<div className="flex gap-8 px-2">
				{avatars.map((avatar) => (
					<button
						type="button"
						key={avatar.id}
						onClick={() => onSelect(avatar.url)}
						className={cn(
							"relative flex-shrink-0 w-48 aspect-square rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 border-2 text-left p-0",
							value === avatar.url
								? "border-primary scale-105 shadow-[0_0_40px_rgba(var(--primary),0.3)]"
								: "border-zinc-800 grayscale hover:grayscale-0 hover:border-zinc-600 opacity-40 hover:opacity-100",
						)}
					>
						{/* biome-ignore lint/performance/noImgElement: intentional */}
						<img
							src={avatar.url}
							alt={`Agent Archetype ${avatar.id}`}
							className="w-full h-full object-cover"
						/>
						{value === avatar.url && (
							<div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
								<div className="bg-primary text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
									Selected
								</div>
							</div>
						)}
					</button>
				))}
				<button
					type="button"
					className="flex-shrink-0 w-48 aspect-square rounded-3xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center gap-2 opacity-40 hover:opacity-100 hover:border-zinc-600 transition-all cursor-pointer bg-transparent"
				>
					<span className="text-2xl">+</span>
					<span className="text-[10px] font-mono uppercase tracking-widest">
						Custom
					</span>
				</button>
			</div>
		</div>
	);
};
