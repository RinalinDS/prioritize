import { useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ActionCreatorsMapObject, bindActionCreators } from 'redux';
import { AppRootStateType } from '../types';

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector


export const useAppDispatch = () => useDispatch()

// useAppDispatch чтобы легче было чето-там делать контретко, чтобы action, который вернулся из редакс тулкита был типизирован, кажется так.


export function useActions<T extends ActionCreatorsMapObject>(actions: T) {
  const dispatch = useAppDispatch()
  return useMemo(() => {
    return bindActionCreators(actions, dispatch)
  }, [actions, dispatch])
}
// кастомный хук useActions позволяет не писать диспатч(санку), а просто вызывать санку, так как она уже будет обернута диспатчем внутри хука,
// поведение подобное mapDispatchToProps в соц.сети, когда передаешь их в одном объекте.