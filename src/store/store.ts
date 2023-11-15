import {combineReducers} from "redux";
import {todolistsReducer} from "./reducers/TodolistsReducer";
import {tasksReducer} from "./reducers/TasksReducer";
import thunkMiddleware from "redux-thunk";
import {appReducer} from "./reducers/AppReducer";
import {authReducer} from './reducers/AuthReducer';
import {configureStore} from '@reduxjs/toolkit';


export const reducers = combineReducers({
  todolists: todolistsReducer,
  tasks: tasksReducer,
  app: appReducer,
  auth: authReducer
})

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunkMiddleware)
})
// На суппорте друг сказал, что можно вообще не использовать миддлвейр если РТК + асинк санки , но я пока все таки буду использовать
// middleware: [thunkMiddleware] , такая запись приводила к ошибке при типизации диспатча, который типизировался тут в сторе, и выдавало ошибку, когда диспатчили санку!


// @ts-expect-error error
window.store = store