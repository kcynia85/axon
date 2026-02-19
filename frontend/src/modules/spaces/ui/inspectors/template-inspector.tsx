import {
  CardBody,
  Button,
  ScrollShadow,
  Link,
  Checkbox
} from "@heroui/react";
import { 
  Plus,
} from "lucide-react";

interface TemplateInspectorProps {
    node: any;
}

export const TemplateInspector = ({ node }: TemplateInspectorProps) => {
    return (
        <CardBody className="p-0 flex flex-col h-full bg-background/50">
            <ScrollShadow className="flex-1 p-4 space-y-6">
                
                {/* Header-like section inside scroll */}
                <div>
                    <h3 className="font-bold text-sm">Actions (To-Do)</h3>
                </div>

                {/* Checklist */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-default-700 dark:text-default-300">1. Cel Researchu (Checklist)</h4>
                        <div className="space-y-1 pl-1">
                            <Checkbox size="sm" defaultSelected={false}><span className="text-xs dark:text-default-400">Zdefiniuj Pytania Badawcze</span></Checkbox>
                            <Checkbox size="sm" defaultSelected={true}><span className="text-xs line-through text-default-400">Indetyfikacja grupy odbiorców</span></Checkbox>
                            <Checkbox size="sm" defaultSelected={false}><span className="text-xs dark:text-default-400">Zidentyfikuj “white space” na rynku</span></Checkbox>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-default-700 dark:text-default-300">2. Profile Konkurencji</h4>
                        <div className="space-y-1 pl-1">
                            <Checkbox size="sm" defaultSelected={false}><span className="text-xs dark:text-default-400">Wypełnij tabelę na podstawie danych</span></Checkbox>
                            <p className="text-[10px] text-default-400 pl-7">(Nazwa firmy + Przewaga +ceny)</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-default-700 dark:text-default-300">3. Wnioski Strategiczne</h4>
                        <div className="space-y-1 pl-1">
                            <Checkbox size="sm" defaultSelected={false}><span className="text-xs dark:text-default-400">Komunikacja</span></Checkbox>
                            <Checkbox size="sm" defaultSelected={false}><span className="text-xs dark:text-default-400">Marketing</span></Checkbox>
                        </div>
                    </div>

                    <Button size="sm" variant="solid" color="default" className="w-full justify-start font-medium" startContent={<Plus size={14}/>}>
                        Dodaj Akcję
                    </Button>
                </div>

                {/* Context */}
                <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold uppercase text-default-500 tracking-wider">Context</h4>
                    <div className="space-y-2">
                        <div className="text-xs">
                            <div className="font-medium dark:text-default-300">brand_guidlines</div>
                            <Link href="#" size="sm" className="text-[10px] text-primary flex items-center gap-1">
                                [ Link ]
                            </Link>
                        </div>
                        <div className="text-xs">
                            <div className="font-medium dark:text-default-300">persona</div>
                            <Link href="#" size="sm" className="text-[10px] text-primary flex items-center gap-1">
                                [ Link ]
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Artefacts */}
                <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold uppercase text-default-500 tracking-wider">Artefacts</h4>
                    
                    <div className="text-xs space-y-1">
                        <div className="font-medium dark:text-default-300">competitors_list</div>
                        <Link href="#" size="sm" className="text-[10px] text-primary block">[ Wklej link ]</Link>
                        <span className="text-[10px] text-default-400">In Progress</span>
                    </div>

                    <div className="text-xs space-y-1 mt-2">
                        <div className="font-medium dark:text-default-300">benchmark_link</div>
                        <Link href="#" size="sm" className="text-[10px] text-primary block">[ Wklej link ]</Link>
                        <span className="text-[10px] text-green-600 dark:text-green-400">Completed</span>
                    </div>

                    <Button size="sm" variant="solid" color="default" className="w-full justify-start font-medium mt-2" startContent={<Plus size={14}/>}>
                        Dodaj Artefakt
                    </Button>
                </div>

            </ScrollShadow>
        </CardBody>
    );
};
