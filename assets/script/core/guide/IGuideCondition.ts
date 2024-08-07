export interface IGuideCondition  {
    getStepCondition(guideId: string, stepId: string): () => boolean;
}

export class DefaultGuideCondition implements IGuideCondition {
    getStepCondition(guideId: string, stepId: string): () => boolean {
        return () => true;
    }
}