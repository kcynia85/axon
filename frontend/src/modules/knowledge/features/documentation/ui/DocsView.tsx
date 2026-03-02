import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/ui/Tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/ui/Accordion";
import { StructuredBacklog, BacklogItem } from "@/shared/lib/docsReader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/shared/ui/ui/Badge";

type DocsViewProps = {
    readonly backlog: StructuredBacklog;
    readonly changelogContent: string;
}

const getPriorityBadgeClasses = (priority: BacklogItem['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500 text-white';
    case 'medium':
      return 'bg-yellow-500 text-black';
    case 'low':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const renderBacklogItems = (items: BacklogItem[]) => {
  if (items.length === 0) return <p className="text-muted-foreground">No items in this priority.</p>;
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="break-words">
          <p className="font-semibold inline-block text-base leading-tight mb-0">{item.title}
          {item.priority && (
            <Badge className={`ml-3 px-2 py-0.5 text-xs font-medium ${getPriorityBadgeClasses(item.priority)}`}>
              {item.priority}
            </Badge>
          )}
          {item.role && (
            <Badge variant="secondary" className="ml-3 px-2 py-0.5 text-xs font-medium">
              {item.role}
            </Badge>
          )}
          </p>
          {item.description.length > 0 && (
            <div className="text-muted-foreground mt-0.5 text-sm">
              {item.description.map((desc, descIndex) => (
                <p key={descIndex} dangerouslySetInnerHTML={{ __html: desc }} className="mb-1 last:mb-0" />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const DocsView = ({ backlog, changelogContent }: DocsViewProps) => {
    return (
        <Tabs defaultValue="backlog" className="flex-1 flex flex-col h-full">
            <TabsList className="w-fit">
                <TabsTrigger value="backlog">Backlog (System)</TabsTrigger>
                <TabsTrigger value="changelog">Changelog (Done)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="backlog" className="flex-1 overflow-auto mt-6 border rounded-md p-6 bg-card">
                <div className="prose dark:prose-invert max-w-none">
                    <h1 className="text-3xl font-bold mb-6">{backlog.mainTitle}</h1>
                    <Accordion type="single" collapsible className="w-full">
                        {backlog.sections.map((section, sectionIndex) => (
                            <AccordionItem key={sectionIndex} value={`item-${sectionIndex}`}>
                                <AccordionTrigger className="text-xl font-bold text-foreground hover:text-foreground/80 pb-0">
                                    {section.title}
                                </AccordionTrigger>
                                <AccordionContent className="">
                                    <div className="space-y-6">
                                        {renderBacklogItems([
                                            ...section.items.high,
                                            ...section.items.medium,
                                            ...section.items.low,
                                        ])}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </TabsContent>
            
            <TabsContent value="changelog" className="flex-1 overflow-auto mt-6 border rounded-md p-6 bg-card">
                <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{changelogContent}</ReactMarkdown>
                </div>
            </TabsContent>
        </Tabs>
    );
};
