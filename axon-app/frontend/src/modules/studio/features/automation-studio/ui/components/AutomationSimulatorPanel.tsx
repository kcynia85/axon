import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Play, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/ui/Card";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import type { AutomationFormData } from "../../types/automation-schema";
import { cn } from "@/shared/lib/utils";

import { useParams } from "next/navigation";
import { useTestAutomation } from "@/modules/workspaces/application/useAutomations";
import { toast } from "sonner";

type TestStatus = "idle" | "running" | "success" | "error";

interface TestResponse {
	statusCode: number | null;
	statusText: string | null;
	durationMs: number | null;
	data: any | null;
}

/**
 * AutomationSimulatorPanel: Interactive panel for simulating automation requests.
 * Standard: Pure View pattern, Zero manual memoization.
 */
export const AutomationSimulatorPanel = ({ className }: { className?: string }) => {
	const { workspace: workspaceId } = useParams<{ workspace: string }>();
	const { watch } = useFormContext<AutomationFormData>();
	const { mutateAsync: executeTest } = useTestAutomation(workspaceId);

	const contextVariables = watch("dataInterface.context") || [];
	const url = watch("connection.url");
	const method = watch("connection.method") || "POST";
	const providerId = watch("connection.automationProviderId");
	const authConfig = watch("connection.auth");
	const isUrlMissing = !url || url.trim() === "";

	const [testInputValues, setTestInputValues] = React.useState<Record<string, string>>({});
	const [testStatus, setTestStatus] = React.useState<TestStatus>("idle");
	const [testResponse, setTestResponse] = React.useState<TestResponse>({
		statusCode: null,
		statusText: null,
		durationMs: null,
		data: null,
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
		if (isUrlMissing) {
			toast.error("Podaj adres URL webhooka w sekcji Definicja przed wykonaniem testu.");
			return;
		}
		
		if (testStatus === "running") return;

		const isValid = validateInputs();
		if (!isValid) {
			toast.error("Popraw błędy w danych testowych.");
			return;
		}

		setTestStatus("running");
		setTestResponse({ statusCode: null, statusText: null, durationMs: null, data: null });
		
		const startTime = performance.now();

		try {
			const result = await executeTest({
				automation_webhook_url: url,
				automation_http_method: method,
				automation_provider_id: providerId || null,
				automation_auth_config: providerId ? null : authConfig,
				test_inputs: testInputValues
			});

			const endTime = performance.now();
			
			setTestResponse({
				statusCode: result.statusCode || (result.success ? 200 : 500),
				statusText: result.statusText || result.message || (result.success ? "OK" : "Error"),
				durationMs: Math.round(endTime - startTime),
				data: result.data
			});
			
			if (result.success) {
				setTestStatus("success");
				toast.success("Test wykonany pomyślnie!");
			} else {
				setTestStatus("error");
				toast.error(`Test zakończony błędem: ${result.message || result.statusText || "Nieznany błąd"}`);
			}
		} catch (error: any) {
			setTestStatus("error");
			setTestResponse({
				statusCode: 0,
				statusText: "Network Error",
				durationMs: null,
				data: { error: error.message || "Błąd połączenia z serwerem" }
			});
			toast.error("Błąd sieci podczas wykonywania testu.");
		}
	};


	return (
		<div className={cn("w-full max-w-sm space-y-6 mt-16 animate-in fade-in slide-in-from-right-8 duration-700 pb-12", className)}>
			<Card className="w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden flex flex-col">
				<CardHeader className="pt-8 pb-6">
					<CardTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
						<Play className="w-5 h-5 text-primary" />
						Symulator
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-8">
					{/* Input Section */}
					<div className="space-y-6">
						<h3 className="text-xs font-bold font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1">Dane Testowe (Input)</h3>

						{contextVariables.length === 0 ? (
							<div className="rounded-xl bg-zinc-50 dark:bg-black/50 border border-zinc-100 dark:border-zinc-900 p-8 text-center">
								<p className="text-sm font-mono text-zinc-500 italic">Brak zmiennych kontekstowych.</p>
							</div>
						) : (
							<div className="space-y-5">
								{contextVariables.map((variable) => (
									<div key={variable.name} className="space-y-2">
										<label className="text-[10px] font-bold font-mono text-zinc-500 dark:text-zinc-400 block uppercase tracking-tight ml-1">
											{variable.name}
											{variable.is_required && <span className="text-primary ml-1">*</span>}
										</label>
										<FormTextField
											placeholder={`Wartość (${variable.field_type})...`}
											value={testInputValues[variable.name] || ""}
											onChange={(e) => handleInputChange(variable.name, e.target.value)}
											className={cn(
												"h-11 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-900",
												validationErrors[variable.name] && "border-red-500 focus:border-red-500"
											)}
										/>
										{validationErrors[variable.name] && (
											<p className="text-[10px] text-red-500 mt-1 ml-1">{validationErrors[variable.name]}</p>
										)}
									</div>
								))}
							</div>
						)}
					</div>

					{/* Action Section */}
					<div className="space-y-3">
						<Button
							type="button"
							variant="secondary"
							size="lg"
							onClick={handleExecuteTest}
							disabled={testStatus === "running"}
							className="w-full h-11 text-xs uppercase font-bold tracking-wider"
						>
							{testStatus === "running" ? (
								<>
									<RefreshCw className="w-4 h-4 animate-spin mr-2" />
									Wykonywanie...
								</>
							) : (
								<>
									<Play className="w-4 h-4 mr-2" />
									Wykonaj Test
								</>
							)}
						</Button>
						{isUrlMissing && (
							<p className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center font-mono uppercase tracking-tighter opacity-70">Wymagany URL w sekcji Definicja</p>
						)}
					</div>

					{/* Output Section */}
					{(testStatus === "success" || testStatus === "error") && (
						<div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-900 animate-in fade-in slide-in-from-top-4 duration-500">
							<h3 className="text-xs font-bold font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1">Odpowiedź (Output)</h3>

							<div className="p-4 rounded-xl bg-zinc-50 dark:bg-black/50 border border-zinc-100 dark:border-zinc-900 font-mono text-[11px] space-y-4">
								<div className="space-y-2">
									<div className="flex justify-between items-center px-1">
										<span className="text-zinc-500">STATUS</span>
										<div className="flex items-center gap-2">
											{testStatus === "success" ? (
												<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
											) : (
												<AlertCircle className="w-3.5 h-3.5 text-red-500" />
											)}
											<span className={cn("font-bold text-right", testStatus === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
												{testResponse.statusCode || ""} {testResponse.statusText}
											</span>
										</div>
									</div>

									<div className="flex justify-between items-center px-1">
										<span className="text-zinc-500">LATENCY</span>
										<span className="text-zinc-900 dark:text-zinc-300 font-bold">{testResponse.durationMs !== null ? `${(testResponse.durationMs / 1000).toFixed(2)}s` : "-"}</span>
									</div>
								</div>

								{testResponse.data !== null && testResponse.data !== undefined && (
									<div className="pt-3 border-t border-zinc-100 dark:border-zinc-900/50 space-y-2">
										<span className="text-zinc-500 block px-1">DATA</span>
										<div className="bg-white dark:bg-zinc-950 rounded-lg p-3 border border-zinc-100 dark:border-zinc-900 overflow-x-auto custom-scrollbar max-h-[200px]">
											<pre className="text-[10px] text-zinc-700 dark:text-zinc-400 whitespace-pre-wrap break-all leading-tight">
												{typeof testResponse.data === 'string' ? (testResponse.data || "Empty response body") : JSON.stringify(testResponse.data, null, 2)}
											</pre>
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

