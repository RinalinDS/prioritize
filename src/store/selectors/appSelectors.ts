import {AppRootStateType} from '../../types';


export const selectStatus = (state: AppRootStateType) => state.app.status
export const selectIsInitialized = (state: AppRootStateType) => state.app.isInitialized
export const selectError = (state: AppRootStateType)  => state.app.error
export const selectTheme = (state: AppRootStateType) => state.app.theme






