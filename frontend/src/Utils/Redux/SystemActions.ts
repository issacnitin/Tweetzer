import { Page } from './SystemState';
import { ChangePageAction } from './Actions';

export const changePage = (page: Page): ChangePageAction => {
    return {
        type: "CHANGE_PAGE",
        page: page
    }
}