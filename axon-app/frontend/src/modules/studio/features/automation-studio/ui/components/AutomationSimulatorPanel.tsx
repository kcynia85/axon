import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Play, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/ui/Card";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import type { AutomationFormData } from "../../types/automation-schema";
import { cn } from "@/shared/lib/utils";

type TestStatus = "idle" | "running" | "success" | "error";

interface TestResponse {
	statusCode: number | null;
	statusText: string | null;
	durationMs: number | null;
}

/**
 * AutomationSimulatorPanel: Interactive panel for simulating automation requests.
 * Standard: Pure View pattern, Zero manual memoization.
 */
export const AutomationSimulatorPanel = ({ className }: { className?: string }) => {
	const { watch } = useFormContext<AutomationFormData>();
	const contextVariables = watch("dataInterface.context") || [];
	const url = watch("connection.url");
	const isUrlMissing = !url || url.trim() === "";

	const [testInputValues, setTestInputValues] = React.useState<Record<string, string>>({});
	const [testStatus, setTestStatus] = React.useState<TestStatus>("idle");
	const [testResponse, setTestResponse] = React.useState<TestResponse>({
		statusCode: null,
		statusText: null,
		durationMs: null,
	});
	const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});

	const handleInputChange = (name: string, value: string) => {
		setTestInputValues((previousInputs) => ({ ...previousInputs, [name]: value }));
		if (validationErrors[name]) {
			setValidationErrors((previousErrors) => {
				const nextErrors = { ...previousErrors };
				delete nextErrors[name];
				return nextErrors;
			});
		}
	};

	const validateInputs = () => {
		const errors: Record<string, string> = {};
		for (const variable of contextVariables) {
			const value = testInputValues[variable.name] || "";

			if (variable.is_required && !value.trim()) {
				errors[variable.name] = "Pole wymagane";
				continue;
			}

			if (value.trim()) {
				if (variable.field_type === "number" && Number.isNaN(Number(value))) {
					errors[variable.name] = "Wymagana liczba";
				} else if (variable.field_type === "boolean" && value.toLowerCase() !== "true" && value.toLowerCase() !== "false") {
					errors[variable.name] = "Wymagane 'true' lub 'false'";
				} else if (variable.field_type === "link" && !/^https?:\/\//.test(value)) {
					errors[variable.name] = "Wymagany poprawny adres URL (http:// lub https://)";
				}
			}
		}

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleExecuteTest = async () => {
		if (isUrlMissing || testStatus === "running") return;

		const isValid = validateInputs();
		if (!isValid) return;

		setTestStatus("running");
		setTestResponse({ statusCode: null, statusText: null, durationMs: null });
		
		// eslint-disable-next-line react-hooks/purity
		const startTime = performance.now();

		try {
			// Mocking actual API call with delay for MVP
			await new Promise((resolve) => setTimeout(resolve, 800));

			// eslint-disable-next-line react-hooks/purity
			const endTime = performance.now();
			setTestResponse({
				statusCode: 200,
				statusText: "OK",
				durationMs: Math.round(endTime - startTime),
			});
			setTestStatus("success");
		} catch (error) {
			setTestStatus("error");
			setTestResponse({
				statusCode: 500,
				statusText: "Internal Server Error",
				durationMs: null,
			});
		}
	};

	return (
		<div className={cn("h-full w-full flex flex-col p-12 justify-center relative", className)}>
			<Card className="w-full bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
				<CardHeader className="pb-6">
					<CardTitle className="text-xl font-bold text-zinc-900 dark:text-white">
						Symulator
					</CardTitle>
				</CardHeader>

				<CardContent className="flex flex-col space-y-8">
					{/* Input Section */}
					<div className="space-y-6">
						<h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">Dane Testowe (Input)</h3>

						{contextVariables.length === 0 ? (
							<p className="text-sm font-mono text-zinc-500 italic">Brak zdefiniowanych zmiennych kontekstowych.</p>
						) : (
							<div className="space-y-4">
								{contextVariables.map((variable) => (
									<div key={variable.name} className="space-y-2">
										<label className="text-xs font-bold font-mono text-zinc-500 dark:text-zinc-400 block">
											{variable.name}
											{variable.is_required && <span className="text-primary ml-1">*</span>}
										</label>
										<FormTextField
											placeholder={`Wprowadź wartość dla ${variable.name} (${variable.field_type})...`}
											value={testInputValues[variable.name] || ""}
											onChange={(textareaEvent) => handleInputChange(variable.name, textareaEvent.target.value)}
											className={cn(
												"h-12 bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800",
												validationErrors[variable.name] && "border-red-500 focus:border-red-500"
											)}
										/>
										{validationErrors[variable.name] && (
											<p className="text-xs text-red-500 mt-1">{validationErrors[variable.name]}</p>
										)}
									</div>
								))}
							</div>
						)}
					</div>

					{/* Action Section */}
					<div className="space-y-2">
						<button
							type="button"
							onClick={handleExecuteTest}
							disabled={isUrlMissing || testStatus === "running"}
							className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center rounded-xl gap-2 font-bold tracking-widest text-xs uppercase disabled:opacity-50"
						>
							{testStatus === "running" ? (
								<>
									<RefreshCw className="w-4 h-4 animate-spin" />
									Wykonywanie...
								</>
							) : (
								<>
									<Play className="w-4 h-4" />
									Wykonaj Test
								</>
							)}
						</button>
						{isUrlMissing && (
							<p className="text-[10px] text-red-500 text-center font-mono">Skonfiguruj połączenie z platformą docelową (URL) przed testem.</p>
						)}
					</div>

					{/* Output Section */}
					<div className={cn("space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800/50 transition-opacity duration-300", (testStatus === "success" || testStatus === "error") ? "opacity-100" : "opacity-0 pointer-events-none hidden")}>
						<h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">Otrzymana odpowiedź (Output)</h3>

						<div className="p-4 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 font-mono text-sm space-y-2">
							<div className="flex justify-between items-center">
								<span className="text-zinc-500">Status:</span>
								<div className="flex items-center gap-2">
									{testStatus === "success" ? (
										<CheckCircle2 className="w-4 h-4 text-green-500" />
									) : testStatus === "error" ? (
										<AlertCircle className="w-4 h-4 text-red-500" />
									) : null}
									<span
										className={cn(
											"font-bold",
											testStatus === "success" ? "text-green-500" : "text-red-500"
										)}
									>
										{testResponse.statusCode} {testResponse.statusText}
									</span>
								</div>
							</div>

							<div className="flex justify-between items-center">
								<span className="text-zinc-500">Czas:</span>
								<span className="text-zinc-900 dark:text-zinc-300">{testResponse.durationMs !== null ? `${(testResponse.durationMs / 1000).toFixed(2)} s` : "-"}</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
