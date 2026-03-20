import { Slider } from "@/shared/ui/ui/Slider";
import { cn } from "@/shared/lib/utils";
import type { FormSliderProps } from "@/shared/types/form/FormPrimitives.types";

export const FormSlider = ({
	value,
	onChange,
	min = 0,
	max = 1,
	step = 0.01,
	labelLeft,
	labelRight,
	className,
}: FormSliderProps) => {
	return (
		<div className={cn("space-y-4", className)}>
			<div className="flex justify-center">
				<span className="text-4xl font-black font-mono text-primary">
					{value}
				</span>
			</div>
			<Slider
				min={min}
				max={max}
				step={step}
				value={[value]}
				onValueChange={(v) => onChange(v[0])}
				className="py-4 cursor-pointer"
			/>
			{(labelLeft || labelRight) && (
				<div className="flex justify-between text-sm font-mono tracking-widest text-zinc-500 -mt-2">
					<span>{labelLeft}</span>
					<span>{labelRight}</span>
				</div>
			)}
		</div>
	);
};
