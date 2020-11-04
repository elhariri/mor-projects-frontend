import React, { useState, useEffect, useRef } from "react"
import { useHistory } from "react-router-dom"

import { useLazyQuery, useMutation } from "@apollo/react-hooks"

import Cookies from "js-cookie"
import _ from "lodash"

import Filter from "../components/advancedFilter"
import NewTaskForm from "../components/board/newTaskForm"
import ActionsBar from "../components/actionsBar"
import { convertDate, Loader } from "../components/utils"
import { CircledAdd } from "../components/icons/utils"

import {
    GET_USER_TASKS_BY_STAGE,
    UPDATE_TASK_TO_DONE,
    ADD_TASK_TO_PROJECT_MAIN,
} from "../components/queries/queries"

import globalStyles from "../styles/global.module.css"
import todoStyles from "../styles/todo.module.css"

const Todo = () => {
    const componentJustMounted = useRef(true)

    const [tasksByProjects, setTasksByProjects] = useState(null)
    const [isEmpty, setIsEmpty] = useState(true)
    const [projects, setProjects] = useState(null)
    const [activeProject, setActiveProject] = useState(null)

    const [addTask, setAddTask] = useState(false)

    const [getTasks, { loading, error }] = useLazyQuery(
        GET_USER_TASKS_BY_STAGE,
        {
            variables: {
                userId: JSON.parse(Cookies.get("user")).id.toString(),
                stage: "doing",
            },
            notifyOnNetworkStatusChange: true,
            fetchPolicy: "network-only",
            onCompleted: (data) => {
                componentJustMounted.current = false
                if (!!data.tasks.length) {
                    const tasks = _.cloneDeep(data.tasks)

                    setTasksByProjects(_.groupBy(tasks, (el) => el.project.id))
                    const projects = _.uniqBy(
                        tasks.map((el) => el.project),
                        (el) => el.id
                    )
                    setProjects(projects)
                    setActiveProject(projects[0])
                    setIsEmpty(false)
                } else {
                    setIsEmpty(true)
                }
            },
        }
    )

    const [updateTask] = useMutation(UPDATE_TASK_TO_DONE, {
        ignoreResults: true,
        //onCompleted: () => getTasks(),
    })

    const [addTaskToProjectMain] = useMutation(ADD_TASK_TO_PROJECT_MAIN, {
        ignoreResults: true,
        //onCompleted: () => getTasks(),
    })

    const onTaskAdd = (task) => {
        setAddTask(false)

        /* think of making the query only use the task Id, its possible */
        addTaskToProjectMain({
            variables: {
                taskId: task.id,
                projectId: activeProject.id,
            },
        })
    }

    const onBeforeTaskCreate = (data) => {
        data.stage = "doing"
        data.project = activeProject.id
        return data
    }

    const actions = [
        {
            action: () => setAddTask(true),
            label: "New task",
            icon: CircledAdd,
        },
    ]

    useEffect(() => {
        componentJustMounted.current && getTasks()
    }, [componentJustMounted, getTasks])

    if (loading) return <Loader />
    if (error) return <p>Error :(</p>

    return (
        <div className={globalStyles.rowFlex}>
            <div style={{ flex: 1, margin: "40px" }}>
                <h1>Todo List</h1>
                <div
                    className={globalStyles.rowFlex}
                    style={{ justifyContent: "space-between" }}
                >
                    {!isEmpty && (
                        <Filter
                            filters={projects}
                            activeFilter={activeProject.id}
                            setActiveFilter={setActiveProject}
                            canAdd={false}
                            canDelete={false}
                            switchFilter={false}
                        />
                    )}

                    <ActionsBar actions={actions} />
                </div>
                {isEmpty ? (
                    <div>you have no tasks</div>
                ) : (
                    <>
                        <div className={globalStyles.columnFlex}>
                            {tasksByProjects[activeProject.id].map((el) => (
                                <TodoItem
                                    key={el.id}
                                    updateTask={updateTask}
                                    {...el}
                                />
                            ))}
                        </div>
                        {addTask && (
                            <NewTaskForm
                                onAdd={onTaskAdd}
                                onCancel={() => setAddTask(false)}
                                preCreate={onBeforeTaskCreate}
                                showAddToMain={true}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

const TodoItem = ({ title, due, phases, id, updateTask }) => {
    const [isVisible, setIsVisible] = useState(true)
    const history = useHistory()
    const onCheck = (e) => {
        e.stopPropagation()
        e.preventDefault()
        const {
            board: { id: boardId },
        } = phases.filter((el) => el.isMain)[0]

        updateTask({
            variables: {
                taskId: id,
                boardId: boardId,
            },
        })

        setTimeout(() => setIsVisible(false), 250)
    }
    return (
        <div
            onClick={() => history.push("/Tasks/" + id)}
            style={{ display: isVisible ? "flex" : "none" }}
            className={`${globalStyles.rowFlex} ${todoStyles.todoElement}`}
        >
            <div className={globalStyles.columnFlex}>
                <span
                    style={{
                        lineHeight: "30px",
                        fontSize: "1.8rem",
                        width: "430px",
                        fontWeight: "bold",
                    }}
                >
                    {title}
                </span>
                <span style={{ lineHeight: "30px" }}>{convertDate(due)}</span>
            </div>
            <input
                type="checkbox"
                onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                }}
                onChange={onCheck}
                className="checkButton"
            />
        </div>
    )
}

export default Todo
