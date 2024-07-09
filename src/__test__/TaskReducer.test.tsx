import {v1} from "uuid";
import {addTask, getTasks, removeTask, tasksReducer, updateTask,} from "../store/reducers/TasksReducer";
import {TaskPriority, TaskStatus} from '../enums';
import {TasksType, TaskType} from '../types';
import {getTodolists} from '../store/reducers/TodolistsReducer';


let todolistID1: string;
let todolistID2: string;

let tasks: TasksType;

beforeEach(() => {
  todolistID1 = 'todolistID1'
  todolistID2 = 'todolistID2'
  tasks = {
    [todolistID1]: [
      {
        id: v1(),
        title: "HTML",
        status: TaskStatus.Completed,
        addedDate: '',
        deadline: '',
        description: '',
        startDate: '',
        order: 0,
        priority: TaskPriority.Low,
        todoListId: todolistID1,
        entityStatus: 'idle'
      },
      {
        id: v1(),
        title: "JS",
        status: TaskStatus.Completed,
        addedDate: '',
        deadline: '',
        description: '',
        startDate: '',
        order: 0,
        priority: TaskPriority.Low,
        todoListId: todolistID1,
        entityStatus: 'idle'
      },
      {
        id: v1(),
        title: "React",
        status: TaskStatus.New,
        addedDate: '',
        deadline: '',
        description: '',
        startDate: '',
        order: 0,
        priority: TaskPriority.Low,
        todoListId: todolistID1,
        entityStatus: 'idle'
      },
      {
        id: v1(),
        title: "Redux",
        status: TaskStatus.New,
        addedDate: '',
        deadline: '',
        description: '',
        startDate: '',
        order: 0,
        priority: TaskPriority.Low,
        todoListId: todolistID1,
        entityStatus: 'idle',
      }
    ],
    [todolistID2]: [
      {
        id: v1(),
        title: "Lucky number of Slevin",
        status: TaskStatus.Completed,
        addedDate: '',
        deadline: '',
        description: '',
        startDate: '',
        order: 0,
        priority: TaskPriority.Low,
        todoListId: todolistID2,
        entityStatus: 'idle',
      },
      {
        id: v1(),
        title: "Inception",
        addedDate: '',
        status: TaskStatus.New,
        deadline: '',
        description: '',
        startDate: '',
        order: 0,
        priority: TaskPriority.Low,
        todoListId: todolistID2,
        entityStatus: 'idle',
      },
    ]
  }
})

test("proper task should be removed", () => {

  const removeProperTask = tasksReducer(tasks, removeTask.fulfilled({
    taskID: tasks[todolistID1][0].id,
    todolistID: todolistID1
  }, '', {taskID: tasks[todolistID1][0].id, todolistID: todolistID1}))

  expect(removeProperTask[todolistID1].length).toBe(3)
  expect(removeProperTask[todolistID2].length).toBe(2)
  expect(removeProperTask[todolistID1][1].title).toBe("React")


})


test("proper task should be added", () => {

  const newTaskTitle = "CSS"
  const task: TaskType = {
    id: '1',
    title: newTaskTitle,
    status: TaskStatus.New,
    addedDate: '',
    startDate: '',
    order: 0,
    priority: TaskPriority.Low,
    todoListId: todolistID1,
    deadline: ' ',
    description: '',
    entityStatus: 'idle'
  }
  const updatedTasks = tasksReducer(tasks, addTask.fulfilled(task, '', {
    todolistID: task.todoListId,
    title: task.title
  }))


  expect(updatedTasks[todolistID1].length).toBe(5)
  expect(updatedTasks[todolistID2].length).toBe(2)
  expect(updatedTasks[todolistID1][2].title).toBe("JS")
  expect(updatedTasks[todolistID1][0].title).toBe("CSS")
})


test("proper task should have new status", () => {
  const task: TaskType = {
    id: '1',
    title: 'DOES IT MATTER?',
    status: TaskStatus.New,
    addedDate: '',
    startDate: '',
    order: 0,
    priority: TaskPriority.Low,
    todoListId: todolistID1,
    deadline: ' ',
    description: '',
    entityStatus: 'idle'
  }
  const updatedTaskStatus = tasksReducer(tasks, updateTask.fulfilled({
    todolistID: todolistID2,
    taskID: tasks[todolistID2][0].id,
    domainModel: {status: TaskStatus.New}
  }, '', {task, domainModel: {status: TaskStatus.New}}))

  expect(updatedTaskStatus[todolistID1].length).toBe(4)
  expect(updatedTaskStatus[todolistID2].length).toBe(2)
  expect(updatedTaskStatus[todolistID1][2].status).toBe(TaskStatus.New)
  expect(updatedTaskStatus[todolistID2][0].status).toBe(TaskStatus.New)
})

test("proper task should have new title", () => {
  const task: TaskType = {
    id: '1',
    title: 'DOES IT MATTER?',
    status: TaskStatus.New,
    addedDate: '',
    startDate: '',
    order: 0,
    priority: TaskPriority.Low,
    todoListId: todolistID1,
    deadline: ' ',
    description: '',
    entityStatus: 'idle'
  }

  const newTaskTitle = "Centurion"

  const updatedTaskTitle = tasksReducer(tasks, updateTask.fulfilled({
    todolistID: todolistID2,
    taskID: tasks[todolistID2][0].id,
    domainModel: {title: newTaskTitle}
  }, '', {task, domainModel: {title: newTaskTitle}}))

  expect(updatedTaskTitle[todolistID1].length).toBe(4)
  expect(updatedTaskTitle[todolistID2].length).toBe(2)
  expect(updatedTaskTitle[todolistID1][2].status).toBe(TaskStatus.New)
  expect(updatedTaskTitle[todolistID2][0].title).toBe("Centurion")
  expect(updatedTaskTitle[todolistID2][1].title).toBe("Inception")
  expect(updatedTaskTitle[todolistID1][0].title).toBe("HTML")
})


test('task for todolist should be added', () => {

  const endState = tasksReducer({todolistID1: [], todolistID2: []}, getTasks.fulfilled({
    tasks: tasks[todolistID1],
    todolistID: todolistID1
  }, '', todolistID1))

  expect(endState[todolistID1].length).toBe(4)
  expect(endState[todolistID2].length).toBe(0)


})


test('empty arrays should be added when we getting todolists from server', () => {

  const action = getTodolists.fulfilled({
    todolists: [{id: '1', title: 'test', addedDate: '', order: 1},
      {id: '2', title: 'test2', addedDate: '', order: 2}]
  }, 'requestID', undefined)

  const endState = tasksReducer({}, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(2)
  expect(endState['1']).toBeDefined()
  expect(endState['2']).toBeDefined()

})
