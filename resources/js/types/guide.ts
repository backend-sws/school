export type StepType = 'standard' | 'graphic' | 'video';

export interface BaseGuideStep {
    element: string;
    title: string;
    description: string;
    type: StepType;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export interface StandardStep extends BaseGuideStep {
    type: 'standard';
}

export interface GraphicStep extends BaseGuideStep {
    type: 'graphic';
    imageUrl: string;
    imageAlt?: string;
}

export interface VideoStep extends BaseGuideStep {
    type: 'video';
    videoUrl: string; // Could be YouTube ID or direct link
}

export type GuideStep = StandardStep | GraphicStep | VideoStep;

export interface GuideDefinition {
    id: string; // Unique ID for persistence
    pageTitle: string; // Title for the page header
    pageSubtitle?: string; // Subtitle for the page header
    pageGuidance: string[]; // Elaborated guidance for the PageGuidance component
    settingsTip?: string; // Pro-tip description for SettingsTip component
    steps: GuideStep[];
}
