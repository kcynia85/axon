import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { settingsApi } from "@/modules/settings/infrastructure/api";

export const useVectorStudio = (
	initialData?: any,
	onSave?: (data: any) => void,
) => {
	const [isTesting, setIsTesting] = useState(false);
	const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

	const splitUrl = (url: string) => {
		const defaults = { user: "postgres", password: "", host: "", port: "5432", dbName: "postgres", ssl: "require" };
		try {
			if (!url) return defaults;
			
			// Handle protocol
			let remaining = url;
			if (url.includes("://")) {
				remaining = url.split("://")[1];
			}

			// Find credentials vs host boundary (last @)
			const atIndex = remaining.lastIndexOf("@");
			if (atIndex === -1) return defaults;

			const authPart = remaining.substring(0, atIndex);
			const hostPartWithDb = remaining.substring(atIndex + 1);

			// Split auth
			const [user, ...pwdParts] = authPart.split(":");
			const password = pwdParts.join(":"); // Rejoin in case password contains colons

			// Split host and db/params
			const [hostAndPort, ...dbAndParams] = hostPartWithDb.split("/");
			const dbFull = dbAndParams.join("/");
			
			const [host, port] = hostAndPort.split(":");
			
			// Extract DB name and params
			const [dbName, paramsStr] = dbFull.split("?");
			let ssl = "require";
			if (paramsStr) {
				const params = new URLSearchParams(paramsStr);
				ssl = params.get("sslmode") || "require";
			}

			return {
				user: user || defaults.user,
				password: decodeURIComponent(password),
				host: host || defaults.host,
				port: port || defaults.port,
				dbName: dbName || defaults.dbName,
				ssl
			};
		} catch (e) {
			console.error("Robust URL split failed", e);
			return defaults;
		}
	};

	const form = useForm({
		defaultValues: {
			vector_database_name: "",
			vector_database_type: "POSTGRES_PGVECTOR_LOCAL",
			vector_database_embedding_model_reference: "",
			vector_database_collection_name: "axon_knowledge_vectors",
			vector_database_expected_dimensions: 768,
			vector_database_index_method: "HNSW",
			vector_database_host: "",
			vector_database_port: 5432,
			vector_database_user: "postgres",
			vector_database_password: "",
			vector_database_db_name: "postgres",
			vector_database_ssl_mode: "disable",
			vector_database_config: {}
		},
	});

	// Handle hydration - only reset when initialData changes and form is not being edited
	useEffect(() => {
		if (initialData && Object.keys(initialData).length > 0) {
			// Skip reset if user has already started editing to prevent losing data
			if (form.formState.isDirty) return;

			const isPostgres = initialData.vector_database_type?.includes("POSTGRES") || 
							 initialData.vector_database_type?.includes("SUPABASE") ||
							 initialData.vector_database_type?.includes("Postgres");

			const urlParts = isPostgres ? splitUrl(initialData.vector_database_connection_url) : null;
			
			// Priority: 1. Direct fields from DB, 2. Parsed from URL, 3. Defaults
			const host = initialData.vector_database_host || urlParts?.host || "";
			const user = initialData.vector_database_user || urlParts?.user || "postgres";
			const dbName = initialData.vector_database_db_name || urlParts?.dbName || "postgres";
			const ssl = initialData.vector_database_ssl_mode || urlParts?.ssl || (isPostgres ? "require" : "disable");
			
			const rawPort = initialData.vector_database_port || (urlParts?.port ? parseInt(urlParts.port) : 5432);
			const port = isNaN(rawPort) ? 5432 : rawPort;

			form.reset({
				...initialData,
				vector_database_host: host,
				vector_database_port: port,
				vector_database_user: user,
				vector_database_password: initialData.vector_database_password || urlParts?.password || "",
				vector_database_db_name: dbName,
				vector_database_ssl_mode: ssl,
				vector_database_config: initialData.vector_database_config || {}
			});
		}
	}, [initialData, form]);

	const {
		activeSectionIdentifier: activeSection,
		setCanvasContainerReference,
		scrollToSectionIdentifier: scrollToSection,
	} = useStudioScrollSpy<string>(["identity", "model", "connection", "indexing"], "identity");

	// Recompose connection URL automatically when relevant fields change
	const watchedFields = useWatch({
		control: form.control,
		name: [
			"vector_database_type",
			"vector_database_host",
			"vector_database_port",
			"vector_database_user",
			"vector_database_password",
			"vector_database_db_name",
			"vector_database_ssl_mode"
		]
	});

	useEffect(() => {
		const [type, host, port, user, password, dbName, ssl] = watchedFields;
		if (!type) return;

		const typeUpper = type.toUpperCase();
		if (typeUpper.includes("POSTGRES") || typeUpper.includes("SUPABASE")) {
			if (host && user && dbName) {
				// Remove leading @ if user pasted it by mistake
				const trimmedHost = host.trim().replace(/^@/, "");
				const trimmedUser = user.trim();
				const trimmedDbName = dbName.trim();
				const trimmedPassword = (password || "").trim();

				const encodedPassword = encodeURIComponent(trimmedPassword);
				const connectionUrl = `postgresql://${trimmedUser}:${encodedPassword}@${trimmedHost}:${port || 5432}/${trimmedDbName}?sslmode=${ssl || "require"}`;
				
				// Only update if different to avoid infinite loops
				if (form.getValues("vector_database_connection_url") !== connectionUrl) {
					form.setValue("vector_database_connection_url", connectionUrl, { shouldDirty: true });
				}
			} else {
				// Clear URL if essential fields are missing
				if (form.getValues("vector_database_connection_url")) {
					form.setValue("vector_database_connection_url", "", { shouldDirty: true });
				}
			}
		}
	}, [watchedFields, form]);

	const handleSave = form.handleSubmit((data) => {
		if (onSave) {
			onSave(data);
		}
	});

	const handleTestConnection = async () => {
		const currentId = initialData?.id;
		if (!currentId) {
			setTestResult({ success: false, message: "Zapisz bazę przed testowaniem połączenia." });
			return;
		}

		setIsTesting(true);
		setTestResult(null);
		try {
			// Trigger a save first to ensure backend tests the latest credentials
			const currentData = form.getValues();
			// We update the DB directly via API to avoid redirecting the user away from the studio
			await settingsApi.updateVectorDatabase(currentId, currentData);

			const result = await settingsApi.testVectorDB(currentId) as any;
			setTestResult({
				success: result.success,
				message: result.message,
				raw_json: result.raw_json
			});
		} catch (error: any) {
			setTestResult({
				success: false,
				message: error.message || "Wystąpił błąd podczas testowania połączenia."
			});
		} finally {
			setIsTesting(false);
		}
	};

	return {
		form,
		activeSection,
		scrollToSection,
		setCanvasContainerReference,
		handleSave,
		handleTestConnection,
		isTesting,
		testResult
	};
};
