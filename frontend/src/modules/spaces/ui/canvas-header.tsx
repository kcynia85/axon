import {
  Card,
  CardBody,
  Chip,
  User,
  Breadcrumbs,
  BreadcrumbItem
} from "@heroui/react";

interface CanvasHeaderProps {
    spaceName: string;
    projectName: string;
}

export const CanvasHeader = ({ spaceName, projectName }: CanvasHeaderProps) => {
    return (
        <div className="absolute top-6 left-6 z-50 pointer-events-none">
             <div className="flex flex-col gap-2 pointer-events-auto">
                 {/* Breadcrumbs */}
                 <Breadcrumbs size="sm" className="mb-1">
                    <BreadcrumbItem href="/spaces">Spaces</BreadcrumbItem>
                    <BreadcrumbItem>{spaceName}</BreadcrumbItem>
                 </Breadcrumbs>

                <Card className="bg-background/70 backdrop-blur-xl border border-default-200/50 shadow-lg rounded-2xl py-2 px-6 min-w-[320px]">
                    <CardBody className="p-0 flex-row justify-between items-center gap-6 overflow-visible">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-bold">{spaceName}</h1>
                                <Chip size="sm" variant="dot" color="success" className="h-4 border-0 px-0">Active</Chip>
                            </div>
                            <span className="text-xs text-default-400">
                                Linked: <span className="text-primary cursor-pointer hover:underline">{projectName}</span>
                            </span>
                        </div>
                    </CardBody>
                </Card>
             </div>
        </div>
    );
};
