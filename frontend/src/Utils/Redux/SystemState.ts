export enum Page {
    DEFAULT,
    LOGIN,
    SIGNUP,
    PROFILE,
    HOME,
    SEARCH
}

export interface ProfileModal {
    name: string;
    username: string;
}
  
export interface SystemState {
    page: Page
    profile?: ProfileModal
    myusername?: string
    searchProfiles?: ProfileModal[]
}