import React, { useState, useEffect, useCallback } from "react"

import { useParams } from "react-router-dom"

import { useQuery, useMutation } from "@apollo/react-hooks"

import Cookies from "js-cookie"

import Projects from "./Projects"

import Filter from "../components/advancedFilter"
import Board from "../components/board"

import BoardForm from "../components/board/newBoardForm"
import { Loader } from "../components/utils"
import { LeftLayout } from "../components/icons/utils"

import { GET_PROJECT, UPDATE_PROJECT } from "../components/queries/queries"

import globalStyles from "../styles/global.module.css"

const Project = () => {
    /* Cookies.set("project", {
		id: defaultBoard.id,
		isMain: defaultBoard.isMain,
	}) */

    let { id } = useParams()
    const [projectId, setProjectId] = useState(id)
    const { loading, error, data: { project } = {}, networkStatus } = useQuery(
        GET_PROJECT,
        {
            variables: { id: id },
            notifyOnNetworkStatusChange: true,
            fetchPolicy: "network-only",
        }
    )

    const [updateProject] = useMutation(UPDATE_PROJECT, {
        ignoreResults: true,
        fetchPolicy: "no-cache",
    })

    const [activeBoard, setActiveBoard] = useState(false)
    const [mainBoard, setMainBoard] = useState(false)
    const [shownForm, setShownForm] = useState("")
    const [projectsAreVisible, setProjectVisibility] = useState(false)

    const setBoard = useCallback(() => {
        const defaultBoard = project.boards.filter(
            (el) => el.title === "main"
        )[0]
        Cookies.set("board", {
            id: defaultBoard.id,
            isMain: defaultBoard.isMain,
        })
        setActiveBoard(defaultBoard)
        setMainBoard(defaultBoard.id)
    }, [project])

    useEffect(() => {
        if (!activeBoard && !!project) {
            setBoard()
        }
    }, [project, activeBoard, setBoard])

    useEffect(() => {
        if (projectId !== id && id === project.id) {
            setBoard()
            setProjectId(id)
        }
    }, [id, projectId, project, setBoard])

    if (error) return <p>Error :(</p>
    if (loading || networkStatus === 4 || !activeBoard) return <Loader />

    return (
        <div style={{ flex: 1 }} className={globalStyles.rowFlex}>
            {projectsAreVisible && (
                <div
                    style={{
                        height: "100vh",
                        overflowY: "scroll",
                        width: "380px",
                        boxShadow:
                            "inset -5px 0px 30px rgba(141, 141, 142, 0.15)",
                        background: "rgb(240, 242, 245)",
                    }}
                >
                    <Projects
                        addProjects={false}
                        containerStyle={{
                            margin: "0",
                            padding: "40px 0 20px 40px",
                        }}
                        filterContainerStyle={{
                            width: "300px",
                            overflowY: "scroll",
                        }}
                    />
                </div>
            )}
            <div
                className={globalStyles.columnFlex}
                style={{ flex: 1, margin: "40px 0 0 40px" }}
            >
                <Title
                    title={project.title}
                    program={project.program}
                    quote={project.quote}
                    click={setProjectVisibility}
                    visible={projectsAreVisible}
                />

                <Filter
                    filters={project.boards}
                    activeFilter={activeBoard.id}
                    setActiveFilter={setActiveBoard}
                    setShownForm={setShownForm}
                    style={{ marginRight: "40px", height: "fit-content" }}
                />
                <Board
                    activeBoard={activeBoard.id}
                    mainBoard={mainBoard}
                    projectId={id}
                />
            </div>
            {shownForm === "create_board" && (
                <BoardForm
                    updateProject={updateProject}
                    project={project}
                    setShownForm={setShownForm}
                />
            )}
        </div>
    )
}

const ShowIcon = ({ click, visible }) => {
    return (
        <button
            onClick={() => click((prev) => !prev)}
            className={`${globalStyles.rowFlex} ${
                globalStyles.showNbIconContainer
            }  ${visible ? globalStyles.showNbIconContainerHover : ""}`}
        >
            <LeftLayout className={globalStyles.showNbIcon} />
        </button>
    )
}

const Title = ({ title, quote, click, visible, program }) => {
    return (
        <h1 className={globalStyles.rowFlex} style={{ lineHeight: "50px" }}>
            <ShowIcon click={click} visible={visible} />
            {!!program && program.title + " : "}
            {title}
            {!!quote && " - " + quote}
        </h1>
    )
}

export default Project
