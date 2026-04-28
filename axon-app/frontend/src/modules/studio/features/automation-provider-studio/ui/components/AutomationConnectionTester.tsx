"use client";

import React from "react";
import { Button } from "@/shared/ui/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/ui/Card";
import { Terminal, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { useTestAutomationConnection } from "@/modules/settings/application/useAutomationProviders";
import { useFormContext } from "react-hook-form";
import { AutomationProviderFormData } from "../../types/automation-provider-schema";

export const AutomationConnectionTester = () => {
    const { watch } = useFormContext<AutomationProviderFormData>();
    const { mutateAsync: testConnection, isPending } = useTestAutomationConnection();
    const [testLogs, setTestLogs] = React.useState<{ msg: string, type: 'info' | 'success' | 'error' }[]>([]);

    const formData = watch();

    const handleRunTest = async () => {
        const timestamp = () => new Date().toLocaleTimeString();
        setTestLogs([{ msg: `[${timestamp()}] Rozpoczynanie testu dla ${formData.platform}...`, type: 'info' }]);
        
        try {
            const result = await testConnection({
                platform: formData.platform,
                base_url: formData.base_url,
                auth_type: formData.auth_type,
                auth_header_name: formData.auth_header_name,
                auth_secret: formData.auth_secret
            });

            if (result.success) {
                setTestLogs(prev => [...prev, { msg: `[${timestamp()}] Success: ${result.message}`, type: 'success' }]);
            } else {
                setTestLogs(prev => [...prev, { msg: `[${timestamp()}] Error: ${result.message}`, type: 'error' }]);
            }
        } catch (e: any) {
            setTestLogs(prev => [...prev, { msg: `[${timestamp()}] Wyjątek: ${e.message || "Błąd sieci"}`, type: 'error' }]);
        }
    };

    return (
        <div className="w-full max-w-sm space-y-6 mt-16 animate-in fade-in slide-in-from-right-8 duration-700">
            <Card className="w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden flex flex-col">
                <CardHeader className="pt-8 pb-6">
                    <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-primary" />
                        Test połączenia
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Button 
                        variant="secondary" 
                        size="lg" 
                        className="w-full h-11 text-xs uppercase font-bold tracking-wider mb-2"
                        onClick={handleRunTest}
                        disabled={isPending || !formData.base_url}
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Przetestuj {formData.platform || "dostawcę"}
                    </Button>

                    {(testLogs.length > 0 || isPending) && (
                        <div className="rounded-xl bg-zinc-50 dark:bg-black/50 border border-zinc-100 dark:border-zinc-900 p-4 min-h-[100px] font-mono text-[11px] relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                            <div className="leading-relaxed space-y-2.5">
                                {testLogs.map((log, i) => (
                                    <div key={i} className="flex gap-2.5">
                                        {log.type === 'success' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />}
                                        {log.type === 'error' && <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />}
                                        {log.type === 'info' && <div className="w-3.5 h-3.5 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center shrink-0 mt-0.5"><div className="w-1 h-1 bg-zinc-400 dark:bg-zinc-500 rounded-full" /></div>}
                                        <span className={
                                            log.type === 'success' ? "text-emerald-600 dark:text-emerald-400 font-bold" : 
                                            log.type === 'error' ? "text-red-600 dark:text-red-400" : 
                                            "text-zinc-600 dark:text-zinc-400"
                                        }>
                                            {log.msg}
                                        </span>
                                    </div>
                                ))}
                                {isPending && (
                                    <div className="flex gap-2 text-zinc-400 dark:text-zinc-500 animate-pulse pl-6">
                                        <span className="text-primary">&gt;</span>
                                        <span>_</span>
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

