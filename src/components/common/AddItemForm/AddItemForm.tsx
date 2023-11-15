import { ChangeEvent, FC, KeyboardEvent, memo, useState } from "react";

import { AddBox } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

export type AddItemFormSubmitHelperType = { setError: (error:string) => void, setTitle: (title:string) => void}
type AddItemFormPropsType = {
  callBack: (title: string, helper: AddItemFormSubmitHelperType) => void
  disabled?: boolean
}

export const AddItemForm: FC<AddItemFormPropsType> = memo(({callBack, disabled}) => {

  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  const onSetNewTitleHandler = (e: ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.currentTarget.value)

  const onEnterKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error) {
      setError(null)
    }
    if (e.key === 'Enter') {
      addItem()
    }
  }
  const addItem = async () => {
    if (newTaskTitle.trim()) {
        await callBack(newTaskTitle.trim(), {setError, setTitle: setNewTaskTitle })

    } else {
      setError("Title is required")
    }
  }
  return (
    <div>
      <TextField
        variant="outlined"
        value={newTaskTitle}
        onChange={onSetNewTitleHandler}
        onKeyPress={onEnterKeyPressHandler}
        error={!!error}
        label="Title"
        helperText={error}
        disabled={disabled}
        style={{backgroundColor: 'white'}}/>
      <IconButton color='primary' onClick={addItem} disabled={disabled} style={{marginLeft: '10px'}}>
        <AddBox/>
      </IconButton>
    </div>
  )
})