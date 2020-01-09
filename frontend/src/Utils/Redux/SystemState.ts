export enum Page {
    DEFAULT,
    LOGIN,
    SIGNUP,
    PROFILE,
    HOME
}
  
export interface SystemState {
    page: Page
    profileid?: string
    myid?: string
}