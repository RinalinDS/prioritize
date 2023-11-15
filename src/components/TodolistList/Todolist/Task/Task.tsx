import React, {ChangeEvent, FC, useCallback} from 'react';

import {EditableSpan} from "../../../common/EditableSpan/EditableSpan";
import {TaskStatus} from '../../../../enums'
import {TaskType} from '../../../../types';
import {useActions, useAppSelector} from '../../../../hooks/storeHooks';
import {TaskActions} from '../../../../store/reducers/TasksReducer';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { Delete } from '@mui/icons-material';


type TaskPropsType = {
  taskID: string
  todolistID: string
}

export const Task: FC<TaskPropsType> = React.memo(({taskID, todolistID}) => {

  const task = useAppSelector<TaskType>(state => state.tasks[todolistID].filter(f => f.id === taskID)[0])

  const {updateTask, removeTask} = useActions(TaskActions)

  const removeTaskHandler = useCallback(() => removeTask({todolistID, taskID}), [taskID, todolistID, removeTask])

  const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    updateTask({task, domainModel: {status: e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New}})
  }, [task, updateTask])

  const changeTaskTitle = useCallback((title: string) =>
    updateTask({task, domainModel: {title}}), [task, updateTask])

  const isTaskDisabled = task.entityStatus === 'loading'
  const isTaskCompleted = task.status === TaskStatus.Completed

  return (
    <div key={task.id} className={isTaskCompleted ? "is-done" : ""} style={{position: 'relative', display:'flex'}}>
      <Checkbox
        checked={isTaskCompleted}
        color="primary"
        onChange={changeTaskStatus}
        disabled={isTaskDisabled}
      />
      <EditableSpan title={task.title} onChange={changeTaskTitle} disabled={isTaskDisabled}/>
      <IconButton size={'small'} onClick={removeTaskHandler} disabled={isTaskDisabled}
                  style={{position: 'absolute', right: '2px', top: '2px'}}>
        <Delete fontSize={'small'}/>
      </IconButton>
    </div>
  );
})

