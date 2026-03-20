import { SpaceAgentCanvasNode } from './SpaceAgentCanvasNode';
import { SpaceAutomationCanvasNode } from './SpaceAutomationCanvasNode';
import { SpaceCrewCanvasNode } from './SpaceCrewCanvasNode';
import { SpaceEntityCanvasNode } from './SpaceEntityCanvasNode';
import { SpacePatternCanvasNode } from './SpacePatternCanvasNode';
import { SpaceServiceCanvasNode } from './SpaceServiceCanvasNode';
import { SpaceTemplateCanvasNode } from './SpaceTemplateCanvasNode';
import { SpaceZoneCanvasNode } from './SpaceZoneCanvasNode';

export const canvasNodeComponents = {
    agent: SpaceAgentCanvasNode,
    automation: SpaceAutomationCanvasNode,
    crew: SpaceCrewCanvasNode,
    entity: SpaceEntityCanvasNode,
    pattern: SpacePatternCanvasNode,
    service: SpaceServiceCanvasNode,
    template: SpaceTemplateCanvasNode,
    zone: SpaceZoneCanvasNode,
};
