'use client';

export const useSpacePatternInspector = (patternNodeInformation: any) => {
    return {
        state: {
            label: patternNodeInformation.data.label as string,
            pipelineSteps: ['Extract raw text', 'Sentiment Analysis', 'Key Topic Extraction', 'Summary Generation']
        }
    };
};
