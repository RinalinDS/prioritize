import { Delete } from "@mui/icons-material";
import { FC, memo, useCallback } from "react";
import { TaskStatus } from '../../../enums';
import { TaskActions } from '../../../store/reducers/TasksReducer';
import { TodoActions } from '../../../store/reducers/TodolistsReducer';
import { selectTheme } from "../../../store/selectors/appSelectors";
import { FilterValueType, TaskType, TodolistDomainType } from '../../../types';
import { AddItemForm, AddItemFormSubmitHelperType } from "../../common/AddItemForm/AddItemForm";
import { EditableSpan } from "../../common/EditableSpan/EditableSpan";

import { storeHooks } from './../../../hooks';
import s from './Todolist.module.css';
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import {Task} from "./Task/Task.tsx";


type TodolistPropsType = {
  todolistID: string
}

export const Todolist: FC<TodolistPropsType> = memo(({todolistID}) => {
  const {useActions, useAppDispatch, useAppSelector} = storeHooks
  const dispatch = useAppDispatch()

  const tasks = useAppSelector<TaskType[]>(state => state.tasks[todolistID])
  const theme = useAppSelector<string>(selectTheme) 
  const todolist = useAppSelector<TodolistDomainType>(state => state.todolists.filter(f => todolistID === f.id)[0])
  const {removeTodolist, changeTodolistTitle, changeFilter} = useActions(TodoActions)

  const isDarkTheme = theme === "dark";
  const changeTodolistFilter = useCallback((filter: FilterValueType) => {
    changeFilter({filter, todolistID: todolistID})
  }, [todolistID, changeFilter])


// ya ne ponimayu kak ya peredal funckii naverx iz additem form suda , no oni sid9t v objecte helper ,
// i tam est callbacki seteerror i settitle, voobwe eto kajets9 plohaya praktika tak delat.
  const addTasksCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
    const thunk = TaskActions.addTask({title, todolistID})
    //@ts-expect-error thunk
    const resultAction = await dispatch(thunk)
    if (TaskActions.addTask.rejected.match(resultAction)) {
      if (resultAction.payload?.errors?.length) {
        const errorMessage = resultAction.payload?.errors[0]
        helper.setError(errorMessage)
      } else {
        helper.setError('some error ocurred')
      }
    } else {
      helper.setTitle('')
    }
  }, [todolistID, dispatch])

  const deleteTodolistHandler = useCallback(() => removeTodolist(todolistID), [todolistID, removeTodolist])


  const changeTodolistTitleHandler = useCallback((title: string) =>
    changeTodolistTitle({todolistID, title}), [todolistID, changeTodolistTitle])

  let tasksForTodolist = tasks
  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter(f => f.status === TaskStatus.New);
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter(f => f.status === TaskStatus.Completed);
  }
  const isTodoDisabled = todolist.entityStatus === 'loading'
  return (
    <div className={`${s.list} ${isDarkTheme ? s.dark: s.light}`}>
      <IconButton size={'small'}
                  onClick={deleteTodolistHandler} style={{position: 'absolute', right: '13px', top: '30px'}}>
        <Delete fontSize={'small'}/>
      </IconButton>
      <h3 style={{marginRight: '35px'}}><EditableSpan title={todolist.title} onChange={changeTodolistTitleHandler}/>

      </h3>
      <AddItemForm callBack={addTasksCallback} disabled={isTodoDisabled}/>

      {tasksForTodolist.map(m => <Task
        key={m.id} todolistID={todolistID}
        taskID={m.id}/>
      )}

      {tasksForTodolist.length < 1 &&
        <div style={{padding: '10px', color: 'grey', justifyContent: 'center'}}>No tasks</div>}

      <div style={{padding: '10px'}}>
        <Button size={'small'} variant={todolist.filter === "all" ? "outlined" : "text"}
                onClick={() => changeTodolistFilter('all')}>All
        </Button>
        <Button size={'small'} variant={todolist.filter === "active" ? "outlined" : "text"}
                onClick={() => changeTodolistFilter('active')} color="secondary">Active
        </Button>
        <Button size={'small'} variant={todolist.filter === "completed" ? "outlined" : "text"}
                onClick={() => changeTodolistFilter('completed')} color="primary">Completed
        </Button>
      </div>
    </div>
  )
})
