import {
  CardBody,
  Button,
  ScrollShadow,
} from "@heroui/react";
import { 
  FileJson,
  Plus,
  Webhook
} from "lucide-react";

interface AutomationInspectorProps {
    node: any;
}

export const AutomationInspector = ({ node }: AutomationInspectorProps) => {
    return (
        <CardBody className="p-0 flex flex-col h-full bg-background/50">
            <ScrollShadow className="flex-1 p-4 space-y-6">
                
                {/* Trigger Button */}
                <Button 
                    color="primary" 
                    variant="solid" 
                    className="w-full font-medium shadow-sm" 
                    startContent={<Webhook size={16} />}
                >
                    Trigger (Webhook)
                </Button>

                {/* Context */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-default-500 tracking-wider">Context</h4>
                    <div className="p-2 bg-default-50 dark:bg-default-800 rounded border border-default-200 text-xs text-default-500 italic">
                        [ File ]
                    </div>
                </div>

                {/* Artefacts */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-default-500 tracking-wider">Artefacts</h4>
                    <div className="p-3 bg-white dark:bg-[#1a1a1a] border border-default-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-default-100 dark:bg-default-800 rounded">
                                <FileJson size={16} className="text-default-600 dark:text-default-400" />
                            </div>
                            <div>
                                <div className="text-xs font-bold">{node.data.artifactName || 'data.json'}</div>
                                <div className="text-[10px] text-green-600 dark:text-green-400 font-medium">Done • In Review</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                    <Button size="sm" variant="solid" color="default" className="w-full justify-start font-medium" startContent={<Plus size={14}/>}>
                        New Artifact (Ręcznie)
                    </Button>
                    <Button size="sm" variant="solid" color="default" className="w-full justify-start font-medium" startContent={<Webhook size={14}/>}>
                        Open n8n Workflow
                    </Button>
                </div>

            </ScrollShadow>
        </CardBody>
    );
};
