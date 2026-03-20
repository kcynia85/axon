"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

type Tool = {
  name: string;
  description: string;
  args_schema: any;
  function_name: string;
  file_path: string;
  module_name: string;
};

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [params, setParams] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8081/api/tools");
      if (!res.ok) throw new Error("Failed to load tools");
      const json = await res.json();
      return json.tools as Tool[];
    },
  });

  const tools = data || [];

  const handleRun = async () => {
    if (!selectedTool) return;
    setLoading(true);
    setTestSuccess(false);
    
    try {
      const res = await fetch(`http://localhost:8081/api/tools/${selectedTool.name}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ params }),
      });
      const data = await res.json();
      setResult(data);
      if (res.ok && !data.error) {
        setTestSuccess(true);
      }
    } catch (err: any) {
      setResult({ error: err.message || "Failed to execute" });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!selectedTool) return;
    setSyncing(true);
    try {
      const res = await fetch(`http://localhost:8081/api/tools/${selectedTool.name}/sync`, {
        method: "POST",
      });
      if (res.ok) {
        alert("Zsynchronizowano z Axon!");
      } else {
        const err = await res.json();
        alert(`Błąd: ${err.detail}`);
      }
    } catch (err: any) {
      alert("Błąd synchronizacji");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-white font-sans">
      {/* Sidebar - Tool List */}
      <div className="w-1/3 border-r border-neutral-800 flex flex-col">
        <div className="p-4 border-b border-neutral-800">
          <h1 className="text-xl font-semibold">Rejestr Funkcji</h1>
          <p className="text-sm text-neutral-400">Axon Internal Tools Dev Env</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading && <p className="text-neutral-500">Ładowanie narzędzi...</p>}
          {error && <p className="text-red-500">Wystąpił błąd podczas ładowania funkcji.</p>}
          {!isLoading && !error && tools.length === 0 && (
            <p className="text-neutral-500">Brak wykrytych funkcji (@tool)</p>
          )}
          {tools.map((t) => (
            <div
              key={t.name}
              onClick={() => {
                setSelectedTool(t);
                setParams({});
                setResult(null);
                setTestSuccess(false);
              }}
              className={`p-3 rounded-md cursor-pointer border transition-colors ${
                selectedTool?.name === t.name
                  ? "bg-neutral-800 border-neutral-700"
                  : "bg-neutral-900 border-transparent hover:border-neutral-800"
              }`}
            >
              <h2 className="font-medium">{t.name}</h2>
              <p className="text-xs text-neutral-400 line-clamp-1">{t.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Area - Split View */}
      <div className="flex-1 flex flex-col">
        {selectedTool ? (
          <div className="flex flex-1 overflow-hidden">
            {/* Left - Input Form */}
            <div className="w-1/2 border-r border-neutral-800 p-6 flex flex-col">
              <h2 className="text-lg font-medium mb-4">Input: {selectedTool.name}</h2>
              <div className="flex-1 overflow-y-auto space-y-4">
                {selectedTool.args_schema?.properties ? (
                  Object.entries(selectedTool.args_schema.properties).map(([key, prop]: [string, any]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-neutral-300 mb-1">
                        {key} {selectedTool.args_schema.required?.includes(key) && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="text"
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-md p-2 text-sm focus:outline-none focus:border-blue-500"
                        placeholder={prop.type || "string"}
                        value={params[key] || ""}
                        onChange={(e) => setParams({ ...params, [key]: e.target.value })}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">Brak argumentów (lub błąd parsowania schematu).</p>
                )}
              </div>
              <div className="pt-4 border-t border-neutral-800 flex justify-between">
                <button
                  onClick={handleRun}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Wykonywanie..." : "Uruchom Test"}
                </button>
                
                <button
                  onClick={handleSync}
                  disabled={!testSuccess || syncing}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                    testSuccess
                      ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                      : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                  }`}
                >
                  {syncing ? "Wysyłanie..." : "Synchronizuj z Axon"}
                </button>
              </div>
            </div>

            {/* Right - Output Console */}
            <div className="w-1/2 p-6 bg-[#0c0c0c] flex flex-col font-mono">
              <h2 className="text-lg font-medium mb-4 text-neutral-300 font-sans">Output</h2>
              <div className="flex-1 overflow-y-auto space-y-4 text-sm">
                {!result && <p className="text-neutral-600">Gotowy. Oczekuję na uruchomienie...</p>}
                
                {result && (
                  <>
                    <div className="mb-4 text-neutral-500">
                      Czas wykonania: <span className="text-neutral-300">{result.execution_time_ms} ms</span>
                    </div>
                    
                    {result.error && (
                      <div className="text-red-400">
                        <h3 className="font-bold text-red-500 mb-1">Błąd:</h3>
                        <pre className="whitespace-pre-wrap">{result.error}</pre>
                      </div>
                    )}
                    
                    {result.logs && (
                      <div>
                        <h3 className="font-bold text-neutral-500 mb-1">Logi (stdout):</h3>
                        <pre className="text-neutral-400 whitespace-pre-wrap">{result.logs}</pre>
                      </div>
                    )}

                    {!result.error && result.result !== undefined && (
                      <div>
                        <h3 className="font-bold text-green-500 mb-1">Zwrócona wartość:</h3>
                        <pre className="text-green-400 whitespace-pre-wrap">
                          {typeof result.result === "object" ? JSON.stringify(result.result, null, 2) : String(result.result)}
                        </pre>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-500">
            Wybierz funkcję z listy po lewej stronie.
          </div>
        )}
      </div>
    </div>
  );
}
