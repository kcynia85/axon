import React from "react";
import { Input } from "@/components/ui/Input";
import type { ToolDetailParametersProps } from "../types/tool-detail.types";

const formatTypeName = (type: string) => {
  const typeString = String(type).toLowerCase();
  if (typeString.includes("str")) return "string";
  if (typeString.includes("int")) return "integer";
  if (typeString.includes("float") || typeString.includes("number")) return "number";
  if (typeString.includes("bool")) return "boolean";
  return "any";
};

const cleanDocstring = (text: string) => {
  if (!text) return "";
  const lines = text.split("\n");
  // Remove empty lines at start and end
  while (lines.length > 0 && lines[0].trim() === "") lines.shift();
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop();
  
  if (lines.length === 0) return "";
  
  // Find minimum indentation of non-empty lines
  const minIndent = lines
    .filter(line => line.trim().length > 0)
    .reduce((min, line) => {
      const match = line.match(/^(\s*)/);
      const indent = match ? match[1].length : 0;
      return indent < min ? indent : min;
    }, Infinity);
    
  return lines.map(line => line.slice(minIndent === Infinity ? 0 : minIndent)).join("\n");
};

export const ToolDetailParameters = ({
  tool,
  parameters,
  onParameterChange,
}: ToolDetailParametersProps) => {
  const hasProperties = tool.args_schema?.properties && Object.keys(tool.args_schema.properties).length > 0;

  return (
    <div className="w-[45%] border-r border-zinc-800/50 p-12 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-12">
        <section>
          <header className="mb-6">
            <h2 className="text-lg font-bold text-zinc-100">
              Interface parameters
            </h2> 
            <p className="text-sm text-zinc-500 mt-1">Configure inputs to test the function's execution.</p>
          </header>
          
          <div className="space-y-6">
            {hasProperties ? (
              Object.entries(tool.args_schema.properties).map(([key, property]: [string, { type?: string; [key: string]: unknown }]) => {
                const isRequired = tool.args_schema.required?.includes(key);
                const typeName = formatTypeName(property.type || "any");
                
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-zinc-200">
                        {key}
                        {isRequired && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">
                        {typeName}
                      </span>
                    </div>
                    <Input
                      placeholder={`e.g. value for ${key}`}
                      value={parameters[key] || ""}
                      onChange={(event) => onParameterChange(key, event.target.value)}
                      className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-200 focus:ring-0 text-base font-bold p-4 rounded-xl placeholder:text-zinc-400 dark:placeholder:text-zinc-700 transition-all text-zinc-900 dark:text-white shadow-inner h-12"
                    />
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                <p className="text-sm text-zinc-500 font-medium">Inputless Module</p>
              </div>
            )}
          </div>
        </section>
        
        <section className="pt-10 border-t border-zinc-800/50">
          <h3 className="text-sm font-bold text-zinc-100 mb-4">
            Documentation
          </h3>
          <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
            <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap font-medium">
              {cleanDocstring(tool.description) || "No description provided."}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
