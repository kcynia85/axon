import React from "react";
import { FormProvider, Controller, type UseFormReturn, useWatch } from "react-hook-form";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { Button } from "@/shared/ui/ui/Button";
import { X, ChevronDown, Cpu } from "lucide-react";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormRadio } from "@/shared/ui/form/FormRadio";
import { MigrationPlanPoster } from "./components/MigrationPlanPoster";
import { GenericStudioSectionNav } from "@/modules/studio/ui/components/StudioSectionNav/GenericStudioSectionNav";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { cn } from "@/shared/lib/utils";
import { Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, Database } from "lucide-react";
import { VECTOR_DB_FIELD_CONFIGS } from "../domain/vector-db-configs";

interface VectorStudioViewProps {
	readonly form: UseFormReturn<any>;
	readonly activeSection: string;
	readonly isSaving?: boolean;
	readonly onSectionClick: (sectionIdentifier: string) => void;
	readonly onExit: () => void;
	readonly onSave: () => void;
	readonly onTestConnection: () => void;
	readonly isTestingConnection?: boolean;
	readonly testResult?: { success: boolean; message: string; raw_json?: any } | null;
	readonly embeddingModels: any[];
	readonly isLoadingModels?: boolean;
	readonly dbTypeOptions?: any[];
	readonly indexMethodOptions?: any[];
	readonly setCanvasContainerReference: (node: HTMLDivElement | null) => void;
}

export const VectorStudioView = ({
	form,
	activeSection,
	isSaving,
	onSectionClick,
	onExit,
	onSave,
	onTestConnection,
	isTestingConnection,
	testResult,
	embeddingModels = [],
	isLoadingModels,
	dbTypeOptions = [],
	indexMethodOptions = [],
	setCanvasContainerReference,
}: VectorStudioViewProps) => {
	const [showPassword, setShowPassword] = React.useState<Record<string, boolean>>({});
	const [showDetails, setShowDetails] = React.useState(false);
	
	const togglePassword = (fieldName: string) => {
		setShowPassword(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
	};

	const sections = [
		{ id: "identity", label: "Tożsamość" },
		{ id: "model", label: "Model" },
		{ id: "connection", label: "Połączenie" },
		{ id: "indexing", label: "Indeksowanie" },
	];

	const selectedType = useWatch({
		control: form.control,
		name: "vector_database_type",
		defaultValue: "POSTGRES_PGVECTOR_LOCAL"
	});

	const expectedDimensions = useWatch({
		control: form.control,
		name: "vector_database_expected_dimensions"
	});

	const configFields = VECTOR_DB_FIELD_CONFIGS[selectedType] || [];

	return (
		<FormProvider {...form}>
			<div className="h-full w-full outline-none" tabIndex={0}>
				<StudioLayout
					studioLabel="Vector DB"
					canvasRef={setCanvasContainerReference}
					exitButton={
						<Button
							variant="ghost"
							size="icon"
							onClick={onExit}
							className="hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all h-9 w-9"
						>
							<X className="w-4 h-4" />
						</Button>
					}
					navigator={
						<GenericStudioSectionNav
							sections={sections}
							activeSection={activeSection}
							onSectionClick={onSectionClick}
						/>
					}
					canvas={
						<div className="px-16 pb-48 pt-20 w-full">
							<form
								className="space-y-16 w-full"
								onSubmit={(formEvent) => formEvent.preventDefault()}
							>
								<FormSection title="Tożsamość Bazy" id="identity" number={1} variant="island">
									<div className="max-w-4xl space-y-8">
										<FormItemField label="Nazwa w Axon" hint="Unikalna nazwa bazy wyświetlana w systemie.">
											<Controller
												name="vector_database_name"
												control={form.control}
												render={({ field }) => (
													<FormTextField
														{...field}
														placeholder="np. Supabase Axon Store"
													/>
												)}
											/>
										</FormItemField>

										<FormItemField label="Technologia">
											<Controller
												name="vector_database_type"
												control={form.control}
												render={({ field }) => (
													<FormSelect
														options={dbTypeOptions}
														value={field.value}
														onChange={field.onChange}
														placeholder="Wybierz typ bazy..."
														renderTrigger={(selected) => (
															<div className="flex items-center gap-3 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl hover:border-zinc-700 transition-colors">
																<Database className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />
																<span
																	className={cn(
																		"text-lg font-bold transition-colors flex-1 text-left",
																		selected.length > 0
																			? "text-white"
																			: "text-zinc-600 group-hover/trigger:text-zinc-400",
																	)}
																>
																	{selected.length > 0
																		? selected[0].name
																		: "Wybierz typ bazy..."}
																</span>
																<ChevronDown className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />
															</div>
														)}
													/>
												)}
											/>
										</FormItemField>
									</div>
								</FormSection>

								<FormSection title="Embedding Model" id="model" number={2} variant="island">
									<div className="max-w-4xl space-y-8">
										<FormItemField label="Wybrany Model">
											<Controller
												name="vector_database_embedding_model_reference"
												control={form.control}
												render={({ field }) => (
													<FormSelect
														options={embeddingModels.map((m) => ({
															id: m.model_id,
															name: `${m.model_provider_name}: ${m.model_id} (${m.model_vector_dimensions})`,
														}))}
														value={field.value}
														onChange={(val) => {
															field.onChange(val);
															// Auto-populate dimensions from the selected model
															const model = embeddingModels.find((m) => m.model_id === val);
															if (model) {
																form.setValue(
																	"vector_database_expected_dimensions",
																	model.model_vector_dimensions,
																);
															}
														}}
														placeholder={
															isLoadingModels ? "Ładowanie modeli..." : "Wybierz model..."
														}
														renderTrigger={(selected) => (
															<div className="flex items-center gap-3 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl hover:border-zinc-700 transition-colors">
																<Cpu className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />
																<span
																	className={cn(
																		"text-lg font-mono transition-colors flex-1 text-left",
																		selected.length > 0
																			? "text-white"
																			: "text-zinc-600 group-hover/trigger:text-zinc-400",
																	)}
																>
																	{selected.length > 0
																		? selected[0].name
																		: "Wybierz model..."}
																</span>
																<ChevronDown className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />
															</div>
														)}
													/>
												)}
											/>
										</FormItemField>

										<div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6">
											<div className="flex items-center justify-between">
												<div className="space-y-1">
													<p className="text-[16px] font-medium text-zinc-400">
														Wymiary Wektorów (Dimensions)
													</p>
													<p className="text-[12px] text-zinc-500">
														Automatycznie dopasowane do wybranego modelu
													</p>
												</div>
												<div className="text-2xl font-mono font-bold text-white bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700">
													{expectedDimensions || "—"}
												</div>
											</div>
										</div>
									</div>
								</FormSection>

								<FormSection
									title="Parametry Połączenia"
									id="connection"
									number={3}
									variant="island"
								>
									<div className="space-y-8 max-w-2xl">
										{configFields.map((field) => (
											<FormItemField 
												key={field.name} 
												label={field.label} 
												hint={field.hint}
											>
												{field.type === "select" ? (
													<Controller
														name={field.name}
														control={form.control}
														render={({ field: controllerField }) => (
															<FormSelect
																options={field.options || []}
																value={controllerField.value}
																onChange={controllerField.onChange}
															/>
														)}
													/>
												) : field.type === "password" ? (
													<Controller
														name={field.name}
														control={form.control}
														render={({ field: controllerField }) => (
															<div className="relative group/password">
																<FormTextField
																	{...controllerField}
																	type={showPassword[field.name] ? "text" : "password"}
																	placeholder={field.placeholder}
																	className="pr-12"
																/>
																<button
																	type="button"
																	onClick={() => togglePassword(field.name)}
																	className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
																>
																	{showPassword[field.name] ? (
																		<EyeOff className="w-5 h-5" />
																	) : (
																		<Eye className="w-5 h-5" />
																	)}
																</button>
															</div>
														)}
													/>
												) : (
													<Controller
														name={field.name}
														control={form.control}
														render={({ field: controllerField }) => (
															<FormTextField
																{...controllerField}
																type={field.type}
																placeholder={field.placeholder}
															/>
														)}
													/>
												)}
											</FormItemField>
										))}

										<FormItemField label="Nazwa Kolekcji (Technical ID)" hint="Techniczna nazwa Twojego zbioru wektorów w bazie. Jeśli wpiszesz nową nazwę, Axon automatycznie utworzy dla niej tabelę podczas pierwszego indeksowania.">
											<Controller
												name="vector_database_collection_name"
												control={form.control}
												render={({ field }) => (
													<FormTextField
														{...field}
														placeholder="np. axon_knowledge_vectors"
													/>
												)}
											/>
										</FormItemField>

										{/* Connection Preview for Postgres-based DBs */}
										{(selectedType === "POSTGRES_PGVECTOR_LOCAL" || selectedType === "SUPABASE_PGVECTOR_CLOUD" || selectedType === "POSTGRES_PGVECTOR") && (
											<div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
												<p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
													Wygenerowany Adres (Podgląd)
												</p>
												<div className="font-mono text-xs text-zinc-400 break-all leading-relaxed">
													postgresql://
													<span className="text-primary">{form.watch("vector_database_user") || "user"}</span>
													:
													<span className="text-zinc-600">••••••••</span>
													@
													<span className="text-white">{form.watch("vector_database_host") || "host"}</span>
													:
													<span className="text-zinc-400">{form.watch("vector_database_port") || "5432"}</span>
													/
													<span className="text-white">{form.watch("vector_database_db_name") || "postgres"}</span>
													?sslmode=
													<span className="text-primary">{form.watch("vector_database_ssl_mode") || "require"}</span>
												</div>
											</div>
										)}

										<div className="pt-4 flex flex-col gap-4">
											<Button
												type="button"
												variant="secondary"
												onClick={onTestConnection}
												disabled={isTestingConnection}
												className="w-fit gap-2"
											>
												{isTestingConnection ? (
													<Loader2 className="w-4 h-4 animate-spin" />
												) : (
													<Database className="w-4 h-4" />
												)}
												Testuj Połączenie
											</Button>

											{testResult && (
												<div className="space-y-3">
													<div
														className={cn(
															"flex items-center justify-between p-3 rounded-lg border text-sm",
															testResult.success
																? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
																: "bg-red-500/10 border-red-500/20 text-red-400"
														)}
													>
														<div className="flex items-center gap-2">
															{testResult.success ? (
																<CheckCircle2 className="w-4 h-4 shrink-0" />
															) : (
																<AlertCircle className="w-4 h-4 shrink-0" />
															)}
															{testResult.message}
														</div>
														
														{testResult.success && testResult.raw_json && (
															<button 
																type="button"
																onClick={() => setShowDetails(!showDetails)}
																className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors"
															>
																{showDetails ? "Ukryj szczegóły" : "Szczegóły połączenia"}
															</button>
														)}
													</div>

													{showDetails && testResult.success && testResult.raw_json && (
														<div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-[12px] space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
															<div className="flex justify-between border-b border-zinc-800 pb-1">
																<span className="text-zinc-500">Server Address:</span>
																<span className="text-emerald-500">{testResult.raw_json.server_addr}</span>
															</div>
															<div className="flex justify-between border-b border-zinc-800 pb-1">
																<span className="text-zinc-500">Server Port:</span>
																<span className="text-zinc-300">{testResult.raw_json.server_port}</span>
															</div>
															<div className="flex justify-between border-b border-zinc-800 pb-1">
																<span className="text-zinc-500">Database:</span>
																<span className="text-zinc-300">{testResult.raw_json.database_name}</span>
															</div>
															<div className="flex flex-col gap-1">
																<span className="text-zinc-500">Version:</span>
																<span className="text-zinc-400 text-[11px] leading-relaxed italic">
																	{testResult.raw_json.server_version}
																</span>
															</div>
															<div className="pt-2 text-[10px] text-zinc-600 text-right uppercase tracking-tighter">
																Verified at: {testResult.raw_json.connection_verified_at}
															</div>
														</div>
													)}
												</div>
											)}
										</div>
									</div>
								</FormSection>

								<FormSection
									title="Indeksowanie (Index Type)"
									id="indexing"
									number={4}
									variant="island"
								>
									<div className="grid grid-cols-1 gap-4 max-w-4xl">
										<Controller
											name="vector_database_index_method"
											control={form.control}
											render={({ field }) => (
												<>
													{indexMethodOptions.map((opt) => (
														<FormRadio
															key={opt.id}
															title={opt.name}
															description={`Metoda indeksowania: ${opt.name}`}
															checked={field.value === opt.id}
															onChange={() => field.onChange(opt.id)}
														/>
													))}
												</>
											)}
										/>
									</div>
								</FormSection>
							</form>
						</div>
					}
					poster={<MigrationPlanPoster />}
					footer={
						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="lg"
								onClick={onExit}
								className="hover:bg-zinc-900 h-11 font-mono text-base tracking-widest px-6 text-zinc-500 hover:text-white transition-all"
							>
								Anuluj
							</Button>
							<ActionButton
								label={isSaving ? "Zapisywanie..." : "Zapisz Bazę"}
								onClick={onSave}
							/>
						</div>
					}
				/>
			</div>
		</FormProvider>
	);
};

