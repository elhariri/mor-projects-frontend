import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"

import { useLazyQuery, useMutation, useApolloClient } from "@apollo/react-hooks"

import _ from "lodash"

import Board from "react-trello-not-safe"

import Task from "./board/task"
import NewTaskForm from "./board/newTaskForm"
import NewPhaseForm from "./board/newPhaseForm"
import LaneHeader from "./board/laneHeader"

import { handleCardMove, Loader } from "./utils"
import {
    GET_BOARD,
    UPDATE_BOARD,
    GET_REDUCED_BOARD,
    CREATE_PHASE_IN_BOARD,
    DELETE_PHASE,
    CREATE_TASK_IN_PHASE,
    UPDATE_PHASE,
    UPDATE_TASK,
    CUSTOM_DELETE_TASK,
} from "./queries/queries"
import { CircledAdd } from "./icons/utils"

import taskStyles from "./task.module.css"

const NewLaneSection = ({ onClick }) => (
    <button
        onClick={onClick}
        className={taskStyles.newLaneSection}
        style={{
            background: "white",
            boxShadow: "0 5px 30px rgba(128, 128, 128, 0.05)",
            borderRadius: "5px",
        }}
    >
        <CircledAdd style={{ width: "20px", marginRight: "10px" }} />
        <span style={{ lineHeight: "20px", fontWeight: "bold" }}>
            new phase
        </span>
    </button>
)

const addNewTask = ({ onClick }) => (
    <button className={taskStyles.addNewTask} onClick={onClick}>
        Click to add a task
    </button>
)

export default ({ activeBoard, mainBoard, projectId }) => {
    const [board, setBoard] = useState(null)
    const client = useApolloClient()
    const history = useHistory()
    const [getBoard, { loading, networkStatus }] = useLazyQuery(GET_BOARD, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            const newBoard = _.cloneDeep(data.board.lanes).map((el) => {
                const newEl = el.phase
                newEl.cards = newEl.cards.map((elem) => elem.card)
                return newEl
            })
            setBoard(newBoard)
        },
    })

    const getServerBoard = async (active) => {
        const {
            data: { board: serverBoard },
        } = await client.query({
            fetchPolicy: "network-only",
            query: GET_REDUCED_BOARD,
            variables: { id: active },
            ignoreResults: true,
        })

        return serverBoard
    }

    const [updateBoard] = useMutation(UPDATE_BOARD, {
        ignoreResults: true,
    })

    const [createPhase] = useMutation(CREATE_PHASE_IN_BOARD, {
        ignoreResults: true,
    })

    const [updatePhase] = useMutation(UPDATE_PHASE, {
        ignoreResults: true,
    })

    const [deletePhase] = useMutation(DELETE_PHASE, {
        ignoreResults: true,
    })
    const [createTask] = useMutation(CREATE_TASK_IN_PHASE, {
        ignoreResults: true,
    })
    const [updateTask] = useMutation(UPDATE_TASK, {
        ignoreResults: true,
    })
    const [deleteTask] = useMutation(CUSTOM_DELETE_TASK, {
        ignoreResults: true,
    })

    const onLaneDelete = (laneId) => {
        deletePhase({
            variables: {
                boardId: activeBoard,
                phaseId: laneId,
            },
        })
    }

    const onLaneAdd = (newLane) => {
        const id = newLane.id
        delete newLane.__typename
        delete newLane.id
        createPhase({
            variables: {
                id: activeBoard,
                data: newLane,
                phaseId: id,
            },
        })
    }

    const handleLaneDragEnd = async (removedIndex, addedIndex) => {
        const oldBoard = await getServerBoard(activeBoard)

        const movedPhase = oldBoard.phases.splice(removedIndex, 1)
        oldBoard.phases.splice(addedIndex, 0, movedPhase[0])
        const newPhases = oldBoard.phases.map((el) => {
            return { phase: el.phase.id }
        })
        updateBoard({
            variables: {
                id: activeBoard,
                data: { phases: newPhases },
            },
        })
    }

    const addCard = async (card, lane) => {
        const { id, addToMainBoard } = card
        createTask({
            variables: {
                phaseId: lane,
                taskId: id,
                addToMain: !!addToMainBoard,
                mainBoard: mainBoard,
                projectId: projectId,
            },
        })
    }

    const onCardDelete = async (cardId, laneId) => {
        const oldBoard = await getServerBoard(activeBoard)
        const phase = {}
        oldBoard.phases.map((el) => {
            if (el.phase.id === laneId) {
                el.phase.tasks = el.phase.tasks.filter(
                    (elem) => elem.task.id !== cardId
                )
                phase.id = el.phase.id
                phase.tasks = el.phase.tasks.map((elem) => ({
                    task: elem.task.id,
                }))
            }
            return el
        })

        updatePhase({
            variables: {
                id: phase.id,
                data: { tasks: phase.tasks },
            },
        })

        deleteTask({
            variables: {
                phaseId: phase.id,
                taskId: cardId,
            },
        })
    }

    const handleDragEnd = async (
        cardId,
        sourceLaneId,
        targetLaneId,
        position
    ) => {
        const oldBoard = await getServerBoard(activeBoard)
        let [sourcePhase, targetPhase] = handleCardMove(
            oldBoard,
            cardId,
            sourceLaneId,
            targetLaneId,
            position
        )
        const targetPhaseType = targetPhase.type
        delete targetPhase.type
        updatePhase({
            variables: {
                id: targetPhase.id,
                data: { tasks: targetPhase.tasks },
            },
        })

        sourceLaneId !== targetLaneId &&
            updatePhase({
                variables: {
                    id: sourcePhase.id,
                    data: { tasks: sourcePhase.tasks },
                },
            })

        updateTask({
            variables: {
                id: cardId,
                data: { stage: targetPhaseType },
            },
        })
    }

    useEffect(() => {
        !!activeBoard && getBoard({ variables: { id: activeBoard } })
    }, [activeBoard, getBoard, projectId])

    if (loading || networkStatus === 4 || !activeBoard || !board)
        return <Loader />

    return (
        <div>
            {
                <Board
                    data={{
                        lanes: board || [],
                    }}
                    editable
                    canAddLanes
                    draggable
                    style={{
                        background: "transparent",
                        padding: 0,
                        height: "auto",
                    }}
                    onLaneDelete={onLaneDelete}
                    onLaneAdd={onLaneAdd}
                    handleLaneDragEnd={handleLaneDragEnd}
                    onCardClick={(cardId) => history.push("/Tasks/" + cardId)}
                    onCardAdd={addCard}
                    onCardDelete={onCardDelete}
                    handleDragEnd={handleDragEnd}
                    components={{
                        Card: Task,
                        NewCardForm: NewTaskForm,
                        NewLaneForm: NewPhaseForm,
                        NewLaneSection: NewLaneSection,
                        LaneHeader: LaneHeader,
                        AddCardLink: addNewTask,
                    }}
                    laneStyle={{
                        borderRadius: "5px",
                        width: "320px",
                        maxHeight: "760px",
                        margin: "5px 10px",
                        backgroundColor: "rgb(240, 242, 245)",
                    }}
                />
            }
        </div>
    )
}

/*  */
