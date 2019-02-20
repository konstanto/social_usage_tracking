export interface Tracking {
    smsSendoutDateTime: string;
    partitipantId: string;
    workplace: boolean;
    workplaceDescription: string;
    facebook: boolean;
    facebookDescription: string;
    location: {
        home: boolean,
        work: boolean,
        travelling: boolean,
        other: boolean
    }
}