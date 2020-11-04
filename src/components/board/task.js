import React, { useState, useEffect } from "react"

import { useMutation } from "@apollo/react-hooks"

import _ from "lodash"
import chroma from "chroma-js"

import TagForm from "./newTagForm"

import {
    Menu,
    convertDate,
    calculateProgression,
    progressionColor,
} from "../utils"
import { UPDATE_TASK, ADD_TASK_TO_MAIN } from "../queries/queries"
import { Check } from "../icons/utils"

import globalStyles from "../../styles/global.module.css"
import taskStyles from "../task.module.css"

const Task = ({
    id,
    title,
    description,
    due,
    onClick: click,
    onDelete,
    tags,
    criticity,
    stage,
    phases,
    laneId,
    phaseStage,
    isMainPhase,
    cover,
    members,
    checklist,
}) => {
    const [addTag, setAddTag] = useState(false)

    const [updateTask] = useMutation(UPDATE_TASK, {
        ignoreResults: true,
    })

    const [addTaskToMain] = useMutation(ADD_TASK_TO_MAIN, {
        ignoreResults: true,
    })

    return (
        <div
            onClick={(data) => click(data)}
            className={`${globalStyles.columnFlex} ${taskStyles.taskContainer}`}
        >
            {!!cover && (
                <div
                    className={`${taskStyles.taskImg} ${taskStyles.smallTaskImg}`}
                    style={{
                        background:
                            "url(" +
                            process.env.REACT_APP_BACKEND_URL +
                            cover.url +
                            ")",
                        backgroundSize: "cover",
                    }}
                ></div>
            )}
            <Header
                title={title}
                criticity={criticity}
                onDelete={onDelete}
                addTaskToMain={addTaskToMain}
                task={id}
                phases={phases}
                phase={laneId}
                stage={stage}
                phaseStage={phaseStage}
            />

            {!!description && !checklist.length && <p>{description}</p>}
            {!!checklist.length && (
                <Checklist
                    checklist={checklist}
                    updateTask={updateTask}
                    id={id}
                />
            )}
            <Tags
                tags={tags}
                phaseStage={phaseStage}
                stage={stage}
                setAddTag={setAddTag}
                isMainPhase={isMainPhase}
                addTag={addTag}
                id={id}
                updateTask={updateTask}
            />
            <div
                style={{
                    marginTop: "5px",
                    justifyContent: "space-between",
                }}
                className={globalStyles.rowFlex}
            >
                {!!due && (
                    <p
                        style={{
                            margin: "0",
                            lineHeight: "28px",
                            fontSize: "12px",
                            color: "var(--dark-font)",
                        }}
                    >
                        {convertDate(due)}
                    </p>
                )}
                <Avatars members={members} />
            </div>
        </div>
    )
}

const Header = ({
    title,
    criticity,
    onDelete,
    addTaskToMain,
    phases = [],
    phase,
    task,
    stage,
    phaseStage,
}) => {
    const menuDeleteTask = (e) => {
        e.stopPropagation()
        e.preventDefault()
        onDelete()
    }

    const addTaskToMainHandler = (e) => {
        e.stopPropagation()
        e.preventDefault()

        addTaskToMain({
            variables: {
                taskId: task,
                phaseId: phase,
            },
        })
    }

    const menuOptions = !!phaseStage
        ? [
              {
                  name: "delete",
                  handler: menuDeleteTask,
              },
          ]
        : [
              {
                  name: "delete",
                  handler: menuDeleteTask,
              },
              {
                  name: "add to main",
                  handler: addTaskToMainHandler,
              },
          ]
    return (
        <div
            style={{
                justifyContent: "space-between",
            }}
            className={`${globalStyles.rowFlex} `}
        >
            <span className={taskStyles.taskTitle}>
                {`${title} `}
                {!!criticity && phaseStage !== "done" && (
                    <Criticity criticity={criticity} />
                )}
            </span>
            <Menu menuOptions={menuOptions} />
        </div>
    )
}

const Criticity = ({ criticity }) => {
    const getCriticity = (num) => {
        const degree = []
        for (let i = 0; i < num; i++) {
            degree.push(i)
        }
        return degree
    }

    return (
        <span
            style={{
                color: "red",
                marginRight: "5px",
                fontWeight: "bold",
            }}
        >
            {getCriticity(criticity).map((e) => "!")}
        </span>
    )
}

const Checklist = ({ checklist, updateTask, id }) => {
    const [checkState, setCheckState] = useState(
        checklist.map((el, i) => {
            el.key = i
            return el
        })
    )
    const [progrssionState, setProgressionState] = useState(
        calculateProgression(checklist)
    )

    const handleCheckList = (element) => {
        let newCheckState = _.cloneDeep(checkState).map((el) => {
            if (el.key === element.key) return element

            return el
        })

        setCheckState(newCheckState)

        const curratedChecklist = _.cloneDeep(newCheckState).map((el) => {
            delete el.key
            delete el.__typename
            return el
        })

        updateTask({
            variables: {
                id: id,
                data: {
                    checklist: curratedChecklist,
                },
            },
        })
    }

    useEffect(() => {
        setProgressionState(calculateProgression(checkState))
    }, [checkState])

    return (
        <div className={globalStyles.columnFlex}>
            <div className={globalStyles.rowFlex}>
                <span
                    style={{
                        width: "85%",
                        position: "relative",
                        display: "flex",
                        margin: "auto 5px auto 0",
                    }}
                >
                    <span
                        style={{
                            width: progrssionState + "%",
                            height: "5px",
                            borderRadius: "5px",
                            background: progressionColor(progrssionState),
                        }}
                    ></span>
                </span>
                {Math.floor(progrssionState)}%
            </div>
            <div className={globalStyles.columnFlex}>
                {checklist.map((el, i) => (
                    <ChecklistElement
                        key={i}
                        element={el}
                        handleCheckList={handleCheckList}
                    />
                ))}
            </div>
        </div>
    )
}

const ChecklistElement = ({ element, handleCheckList }) => {
    const [isDone, setDone] = useState(element)
    const handleCheck = (e) => {
        e.stopPropagation()
        e.preventDefault()
        const newState = {
            key: isDone.key,
            title: isDone.title,
            done: !isDone.done,
        }
        setDone(newState)
        handleCheckList(newState)
    }

    return (
        <div
            className={`${globalStyles.rowFlex} ${taskStyles.checkElement}`}
            style={{
                fontSize: "1.3rem",
                textDecoration: !!isDone.done ? "line-through" : "none",
            }}
        >
            <span
                className={taskStyles.checkIcon}
                style={{
                    background: !!isDone.done ? "var(--main-color)" : "white",
                }}
                onClick={handleCheck}
            >
                <Check style={{ margin: "2px", fill: "white" }} />
            </span>
            {element.title}
        </div>
    )
}

const Tags = ({
    tags,
    setAddTag,
    stage,
    phaseStage,
    isMainPhase,
    addTag,
    id,
    updateTask,
}) => {
    const [offset, setOffset] = useState({})
    const addTagClick = (e) => {
        e.stopPropagation()
        e.preventDefault()
        setOffset(e.target.getBoundingClientRect())
        setAddTag(true)
    }

    return (
        <div className={globalStyles.rowFlex}>
            {stage === "done" && phaseStage !== "done" && (
                <span
                    className={taskStyles.tag}
                    style={{
                        background: chroma("#53d769").alpha(0.15).css(),
                        color: "var(--green-color)",
                        fontWeight: "700",
                    }}
                >
                    <Check
                        style={{
                            fill: "var(--green-color)",
                            width: "10px",
                            marginRight: "5px",
                        }}
                    />
                    Done
                </span>
            )}
            {!!tags.length &&
                tags.map((el, i) => {
                    const color = chroma(el.color)
                    return (
                        <span
                            className={taskStyles.tag}
                            style={{
                                background: color.alpha(0.15).css(),
                                color: el.color,
                            }}
                            key={i}
                        >
                            {el.tag}
                        </span>
                    )
                })}
            {phaseStage !== "done" && (
                <div
                    onClick={addTagClick}
                    className={taskStyles.tag}
                    style={{
                        background: "#f1f3f6",
                        color: "#71767d",
                        position: "relative",
                    }}
                >
                    + tag
                    {addTag && (
                        <TagForm
                            setAddTag={setAddTag}
                            tags={tags}
                            id={id}
                            addTag={addTag}
                            updateTask={updateTask}
                            offset={offset}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

const Avatars = ({ members }) => {
    return (
        <div
            style={{
                flexDirection: "row-reverse",
                margin: "0 0 0 auto",
            }}
            className={`${globalStyles.rowFlex} `}
        >
            {members.map((el, i) => {
                if (!!el.photo)
                    return (
                        <img
                            key={i}
                            alt={el.username}
                            src={
                                process.env.REACT_APP_BACKEND_URL + el.photo.url
                            }
                            style={{
                                position: "relative",
                                width: "28px",
                                height: "28px",
                                right: -10 * i + "px",
                                border: "2px solid white",
                                borderRadius: "20px",
                            }}
                        />
                    )
                return null
            })}
        </div>
    )
}

export default Task
