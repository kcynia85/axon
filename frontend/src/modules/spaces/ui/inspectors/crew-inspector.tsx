import {
  CardBody,
  Button,
  Input,
  ScrollShadow
} from "@heroui/react";
import { 
  AlertCircle, 
  CheckCircle2, 
  Play,
  Settings
} from "lucide-react";

interface CrewInspectorProps {
    node: any;
}

export const CrewInspector = ({ node }: CrewInspectorProps) => {
    const state = node.data.state || 'missing_context';

    return (
        <CardBody className="p-0 flex flex-col h-full bg-background/50">
            {/* Functional Header */}
            <div className="p-4 border-b border-default-100">
                 <Button size="sm" variant="solid" color="warning" className="w-full text-white font-medium shadow-sm" startContent={<Play size={14} />}>Execute Crew</Button>
            </div>

            <ScrollShadow className="flex-1">
                {/* STATE: MISSING CONTEXT */}
                {state === 'missing_context' && (
                    <div className="p-4 space-y-6">
                        <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-100 dark:border-orange-900">
                            <h4 className="text-xs font-bold text-orange-800 dark:text-orange-400 mb-1 flex items-center gap-2">
                                <AlertCircle size={12} /> Note
                            </h4>
                            <p className="text-xs text-orange-700 dark:text-orange-300">
                                Fill in the required context. The Content Pipeline needs this data to execute the sequence.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase text-default-500 tracking-wider">Proposed Sequence</h4>
                            <div className="space-y-2 relative">
                                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-default-200 dark:bg-default-700"></div>
                                <div className="relative pl-6">
                                    <div className="w-5 h-5 rounded-full bg-default-100 dark:bg-default-800 border border-default-300 dark:border-default-600 absolute left-0 flex items-center justify-center text-[10px] font-bold">1</div>
                                    <p className="text-xs font-bold">Web Researcher</p>
                                    <p className="text-[10px] text-default-500">Goal: Gather data</p>
                                </div>
                                <div className="relative pl-6">
                                    <div className="w-5 h-5 rounded-full bg-default-100 dark:bg-default-800 border border-default-300 dark:border-default-600 absolute left-0 flex items-center justify-center text-[10px] font-bold">2</div>
                                    <p className="text-xs font-bold">Content Writer</p>
                                    <p className="text-[10px] text-default-500">Goal: Write content</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="solid" color="primary" className="flex-1 font-medium shadow-sm">Approve Queue</Button>
                            <Button size="sm" variant="solid" color="default" className="flex-1 font-medium bg-default-200 dark:bg-default-800" startContent={<Settings size={14}/>}>Edit Goals</Button>
                        </div>

                        <div className="space-y-3 pt-2">
                            <h4 className="text-xs font-bold uppercase text-default-500 tracking-wider">Context</h4>
                            <Input label="Topic" placeholder="Enter topic..." size="sm" variant="bordered" labelPlacement="outside" />
                        </div>
                    </div>
                )}

                {/* STATE: WORKING */}
                {state === 'working' && (
                    <div className="p-4 space-y-6">
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase text-default-500 tracking-wider">Live Hierarchy</h4>
                            <div className="space-y-2">
                                <div className="p-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-green-800 dark:text-green-400">1. Web Researcher</span>
                                        <span className="text-[10px] bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-1.5 rounded">Done</span>
                                    </div>
                                    <p className="text-[10px] text-green-700 dark:text-green-500">trends_list.md</p>
                                </div>
                                <div className="p-2 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-yellow-800 dark:text-yellow-400">2. Content Writer</span>
                                        <span className="text-[10px] bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-1.5 rounded animate-pulse">Working...</span>
                                    </div>
                                    <p className="text-[10px] text-yellow-700 dark:text-yellow-500">"Generating headlines..."</p>
                                </div>
                            </div>
                        </div>
                        <Button color="danger" variant="solid" size="sm" className="w-full font-medium">Stop Work</Button>
                    </div>
                )}

                {/* STATE: DONE */}
                {state === 'done' && (
                    <div className="p-4 space-y-6">
                        <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-100 dark:border-green-900 flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
                            <span className="text-xs font-medium text-green-800 dark:text-green-200">Your artifacts are ready</span>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase text-default-500 tracking-wider">Details</h4>
                            <div className="text-xs space-y-1 text-default-600 dark:text-default-400">
                                <p>• Article about AI in education</p>
                                <p>• Over 2,000 words</p>
                                <p>• Clear structure with headings</p>
                            </div>
                            <div className="text-[10px] text-default-400 mt-2">
                                Total time: 4 min<br/>
                                Total cost: 6,800 tokens
                            </div>
                        </div>
                    </div>
                )}
            </ScrollShadow>
        </CardBody>
    );
};
