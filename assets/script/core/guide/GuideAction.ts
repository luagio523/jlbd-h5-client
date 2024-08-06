export enum GuideActionType {
    SHOW_MESSAGE,
    CLICK,
    SWIPE
}

export interface GuideAction {
    type: GuideActionType;
    data: any;
}
