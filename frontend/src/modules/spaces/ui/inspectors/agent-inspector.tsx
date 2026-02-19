import {
  CardBody,
  Tabs,
  Tab,
  Button,
  Input,
  Textarea,
  Chip,
  Progress,
  ScrollShadow
} from "@heroui/react";
import { 
  Play, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  PauseCircle,
  Clock,
  Coins,
  Settings2
} from "lucide-react";

interface AgentInspectorProps {
    node: any;
}

export const AgentInspector = ({ node }: AgentInspectorProps) => {
    const state = node.data.state || 'missing_context';

    return (
        <CardBody className="p-0 flex flex-col h-full bg-background/50">
            {/* Action Buttons (Solid variants) */}
            <div className="p-4 border-b border-default-100 flex gap-2">
                <Button size="sm" color="primary" variant="solid" className="flex-1 font-medium shadow-sm" startContent={<Play size={14} />}>Run Task</Button>
                <Button size="sm" variant="solid" className="flex-1 font-medium bg-default-200 dark:bg-default-800" startContent={<Settings2 size={14} />}>Edit Prompt</Button>
            </div>

            <Tabs 
                aria-label="Inspector" 
                size="md" 
                variant="underlined"
                classNames={{
                    tabList: "px-4 w-full border-b border-default-100/50",
                    cursor: "w-full bg-primary",
                    tab: "max-w-fit px-0 h-10 mr-4 font-medium",
                    tabContent: "group-data-[selected=true]:text-primary"
                }}
            >
                <Tab key="chat" title="Chat">
                    <div className="p-4 flex flex-col h-[400px]">
                        <ScrollShadow className="flex-1 space-y-4 mb-4">
                             <div className="flex gap-3">
                                 <div className="w-6 h-6 rounded-full bg-default-200"></div>
                                 <div className="bg-default-100 dark:bg-default-800 p-2 rounded-lg text-sm rounded-tl-none">
                                     Analyze these user interviews.
                                 </div>
                             </div>
                             <div className="flex gap-3 flex-row-reverse">
                                 <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px]">AG</div>
                                 <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-sm rounded-tr-none border border-blue-100 dark:border-blue-900">
                                     Sure. Based on the 3 files provided, users are struggling with...
                                 </div>
                             </div>
                        </ScrollShadow>
                        <Input placeholder="Message agent..." size="sm" variant="bordered" />
                    </div>
                </Tab>
                <Tab key="config" title="Configuration">
                    <div className="p-4 space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold">System Instructions</label>
                            <Textarea 
                                minRows={4} 
                                variant="bordered"
                                defaultValue="You are an expert User Researcher. Your goal is to synthesize qualitative data into actionable insights." 
                                className="text-xs"
                            />
                        </div>
                         <div className="space-y-1">
                            <label className="text-xs font-semibold">Tools</label>
                            <div className="flex flex-wrap gap-2">
                                <Chip size="sm" onClose={() => {}}>SearchKnowledge</Chip>
                                <Chip size="sm" onClose={() => {}}>SummarizeText</Chip>
                                <Button size="sm" variant="solid" color="default" className="h-6 text-[10px]">+ Add</Button>
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab key="memory" title="Memory">
                    <div className="p-4">
                         <div className="text-center text-default-400 py-8">
                             <p className="text-xs">Short-term memory empty.</p>
                         </div>
                    </div>
                </Tab>
            </Tabs>
        </CardBody>
    );
};
