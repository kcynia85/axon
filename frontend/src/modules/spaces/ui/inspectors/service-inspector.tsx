import {
  CardBody,
  Button,
  ScrollShadow,
} from "@heroui/react";
import { 
  ExternalLink,
  Plus,
  Music
} from "lucide-react";

interface ServiceInspectorProps {
    node: any;
}

export const ServiceInspector = ({ node }: ServiceInspectorProps) => {
    return (
        <CardBody className="p-0 flex flex-col h-full bg-background/50">
            <ScrollShadow className="flex-1 p-4 space-y-6">
                
                {/* Capability Info */}
                <div className="space-y-1">
                    <h3 className="font-bold text-sm">{node.data.actionName}</h3>
                    <p className="text-[10px] text-default-500">Capability: Text-to-Speech</p>
                </div>

                {/* Artefacts */}
                <div className="space-y-2">
                    <div className="p-3 bg-white dark:bg-[#1a1a1a] border border-default-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-default-100 dark:bg-default-800 rounded">
                                <Music size={16} className="text-default-600 dark:text-default-400" />
                            </div>
                            <div>
                                <div className="text-xs font-bold">Intro Voiceover_v1.mp3</div>
                                <div className="text-[10px] text-default-500">Status: In Review</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                    <Button size="sm" variant="solid" color="default" className="w-full justify-start font-medium" startContent={<Plus size={14}/>}>
                        Dodaj Artefakt
                    </Button>
                    <Button size="sm" variant="solid" color="default" className="w-full justify-start font-medium" startContent={<ExternalLink size={14}/>}>
                        Open {node.data.label}
                    </Button>
                </div>

            </ScrollShadow>
        </CardBody>
    );
};
