export enum Page {
    DEFAULT,
    LOGIN,
    SIGNUP,
    PROFILE,
    HOME,
    SEARCH
}

export interface ProfileModal {
    profileId: string;
    name: string;
    username: string;
}
  
export interface SystemState {
    page: Page
    profile?: ProfileModal
    myid?: string
    profileIdLoaded?: string
}