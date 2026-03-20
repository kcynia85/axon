"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { Button } from "@/shared/ui/ui/Button";
import { Input } from "@/shared/ui/ui/Input";
import { Label } from "@/shared/ui/ui/Label";
import { Textarea } from "@/shared/ui/ui/Textarea";
import { Badge } from "@/shared/ui/ui/Badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/ui/Select";
import { Checkbox } from "@/shared/ui/ui/Checkbox";
import { Wrench, Save, Code, ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { InternalToolEditorViewProps, InternalToolCategory } from "../types/internal-tool-editor.types";

/**
 * InternalToolEditorView: Pure presentation layer for the tool editor.
 * Standard: 0% Logic, 0% useEffect.
 */
export const InternalToolEditorView = ({
    tool,
    toolData,
    inputSchemaJson,
    outputSchemaJson,
    onUpdateToolData,
    onUpdateInputSchemaJson,
    onUpdateOutputSchemaJson,
    onSave
}: InternalToolEditorViewProps) => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/resources/tools">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {tool ? "Edit Tool" : "New Internal Tool"}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Define native tool capabilities
                        </p>
                    </div>
                </div>
                <Button onClick={onSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Tool
                </Button>
            </div>

            {/* Basic Info */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-primary" />
                        <CardTitle>Tool Identity</CardTitle>
                    </div>
                    <CardDescription>Basic tool metadata and configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="function_name">Function Name *</Label>
                            <Input
                                id="function_name"
                                value={toolData.tool_function_name}
                                onChange={(changeEvent) => onUpdateToolData({ tool_function_name: changeEvent.target.value })}
                                placeholder="search_knowledge"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="display_name">Display Name *</Label>
                            <Input
                                id="display_name"
                                value={toolData.tool_display_name}
                                onChange={(changeEvent) => onUpdateToolData({ tool_display_name: changeEvent.target.value })}
                                placeholder="Search Knowledge"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={toolData.tool_description}
                            onChange={(changeEvent) => onUpdateToolData({ tool_description: changeEvent.target.value })}
                            placeholder="What does this tool do?"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                value={toolData.tool_category}
                                onValueChange={(value) => onUpdateToolData({ tool_category: value as InternalToolCategory })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Primeval">Primeval</SelectItem>
                                    <SelectItem value="AI_Utils">AI Utils</SelectItem>
                                    <SelectItem value="Systems">Systems</SelectItem>
                                    <SelectItem value="Local">Local</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <div className="flex items-center gap-2 pt-2">
                                <Checkbox
                                    id="is_active"
                                    checked={toolData.tool_is_active}
                                    onCheckedChange={(checked: boolean) => onUpdateToolData({ tool_is_active: checked })}
                                />
                                <label htmlFor="is_active" className="text-sm cursor-pointer">
                                    {toolData.tool_is_active ? "Active" : "Inactive"}
                                </label>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Schema */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-primary" />
                        <CardTitle>Data Schema</CardTitle>
                    </div>
                    <CardDescription>JSON Schema for tool input/output</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Input Schema (JSON)</Label>
                        <Textarea
                            value={inputSchemaJson}
                            onChange={(changeEvent) => onUpdateInputSchemaJson(changeEvent.target.value)}
                            placeholder='{"type": "object", "properties": {}}'
                            rows={8}
                            className="font-mono text-xs"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Output Schema (JSON)</Label>
                        <Textarea
                            value={outputSchemaJson}
                            onChange={(changeEvent) => onUpdateOutputSchemaJson(changeEvent.target.value)}
                            placeholder='{"type": "object", "properties": {}}'
                            rows={8}
                            className="font-mono text-xs"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Keywords */}
            <Card>
                <CardHeader>
                    <CardTitle>Keywords</CardTitle>
                    <CardDescription>Tags for tool discovery</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {toolData.tool_keywords?.map((keyword, index) => (
                            <Badge key={index} variant="secondary">{keyword}</Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
