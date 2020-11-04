import React, { useState } from "react"
import { useParams } from "react-router-dom"

import { useQuery, useMutation } from "@apollo/react-hooks"

import Cookies from "js-cookie"

import CardContainer from "../components/cardContainer"
import NewProjectForm from "../components/newProjectForm"
import ActionsBar from "../components/actionsBar"

import { CircledAdd, LinkIcon } from "../components/icons/utils"
import { Loader } from "../components/utils"
import {
    GET_ALL_PROJECTS_BY_PROGRAM_BY_USER,
    GET_ALL_PROJECTS_WITH_NO_PROGRAM_BY_ADMIN,
    UPDATE_PROGRAM,
    CREATE_PROJECT,
    DELETE_PROJECT,
} from "../components/queries/queries"

import globalStyles from "../styles/global.module.css"

const Projects = () => {
    let { id } = useParams()
    const { loading, error, data, refetch, networkStatus } = useQuery(
        GET_ALL_PROJECTS_BY_PROGRAM_BY_USER,
        {
            notifyOnNetworkStatusChange: true,
            variables: {
                id: JSON.parse(Cookies.get("user")).id,
                programId: id,
            },
            fetchPolicy: "network-only",
        }
    )

    const [updateProgram] = useMutation(UPDATE_PROGRAM, {
        onCompleted: () => {
            refetch()
        },
    })

    const [createProject] = useMutation(CREATE_PROJECT, {
        onCompleted: () => {
            setNewProject(false)
            refetch()
        },
    })

    const [deleteProject] = useMutation(DELETE_PROJECT, {
        onCompleted: () => {
            refetch()
        },
    })

    const [newProject, setNewProject] = useState(false)
    const [addProject, setAddProject] = useState(false)

    const injectProgram = (data) => {
        data.program = id
        return data
    }

    return (
        <div style={{ flex: 1, margin: "65px" }}>
            {(() => {
                if (loading || networkStatus === 4) return <Loader />
                if (error) return <p>Error :({JSON.stringify(error)}</p>

                return (
                    <>
                        <h1>{data.program.title} - Projects</h1>
                        <ProjectsDisplay
                            projects={data.projects}
                            setNewProject={setNewProject}
                            deleteProject={deleteProject}
                            setAddProject={setAddProject}
                        />
                    </>
                )
            })()}
            {newProject && (
                <NewProjectForm
                    preCreate={injectProgram}
                    createProject={createProject}
                    setNewProject={setNewProject}
                />
            )}
            {addProject && (
                <LinkProject
                    cancel={() => setAddProject(false)}
                    click={updateProgram}
                />
            )}
        </div>
    )
}

const ProjectsDisplay = ({
    projects,
    setNewProject,
    deleteProject,
    setAddProject,
}) => {
    const actions = [
        {
            action: () => setNewProject(true),
            label: "New project",
            icon: CircledAdd,
        },
        {
            action: () => setAddProject(true),
            label: "Add project",
            icon: LinkIcon,
        },
    ]

    const deleteProjectHandler = (e, id) => {
        e.stopPropagation()
        e.preventDefault()

        deleteProject({
            variables: {
                projectId: id,
            },
        })
    }

    return (
        <div>
            <div
                className={`${globalStyles.rowFlex}`}
                style={{ justifyContent: "space-between" }}
            >
                <ActionsBar actions={actions} />
            </div>
            <div
                className={`${globalStyles.rowFlex}`}
                style={{
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                }}
            >
                {projects.map((el, i) => {
                    const menuOptions = [
                        {
                            name: "delete",
                            handler: (e) => deleteProjectHandler(e, el.id),
                        },
                    ]
                    return (
                        <CardContainer
                            key={i}
                            data={el}
                            style={{
                                background: "white",
                                marginRight: "40px",
                                width: "320px",
                            }}
                            menuOptions={menuOptions}
                        />
                    )
                })}
            </div>
        </div>
    )
}

const LinkProject = ({ cancel, click }) => {
    let { id } = useParams()
    const [projects, setProjects] = useState([])
    const { loading, error, data, networkStatus } = useQuery(
        GET_ALL_PROJECTS_WITH_NO_PROGRAM_BY_ADMIN,
        {
            notifyOnNetworkStatusChange: true,
            variables: {
                id: JSON.parse(Cookies.get("user")).id,
            },
            fetchPolicy: "network-only",
        }
    )

    const linkHandler = () => {
        click({
            variables: {
                id: id,
                data: { projects: projects },
            },
        })
        cancel()
    }

    const onCheck = (e, id) => {
        if (e.target.checked) {
            setProjects((prev) => prev.concat(id))
        } else {
            setProjects((prev) => prev.filter((el) => el !== id))
        }
    }

    if (loading || networkStatus === 4) return <Loader />
    if (error) return <p>Error :({JSON.stringify(error)}</p>

    return (
        <div className={`${globalStyles.popUpContainer} add-form`}>
            <div
                onClick={cancel}
                className={globalStyles.popUpBackground}
            ></div>
            <div
                className={`${globalStyles.messageConatiner} ${globalStyles.columnFlex}`}
            >
                <span
                    style={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        height: "30px",
                        width: "300px",
                        textAlign: "start",
                        borderBottom: "1px solid grey",
                        marginBottom: "30px",
                    }}
                >
                    Projects
                </span>
                {data.projects.map((el, i) => (
                    <span
                        key={i}
                        style={{
                            display: "flex",
                            height: "32px",
                            lineHeight: "28px",
                        }}
                    >
                        <input
                            style={{ marginRight: "10px" }}
                            type="checkbox"
                            onChange={(e) => onCheck(e, el.id)}
                            className="checkButton"
                        />
                        {el.title}
                    </span>
                ))}
                {!!!data.projects.length &&
                    "Oops all your project belongs already to a program"}
                {!!data.projects.length && (
                    <button
                        type="submit"
                        style={{ marginTop: "40px" }}
                        className={globalStyles.bigFormButton}
                        onClick={linkHandler}
                    >
                        Link!
                    </button>
                )}
                {!data.projects.length && (
                    <button
                        type="submit"
                        style={{ marginTop: "40px", background: "red" }}
                        className={globalStyles.bigFormButton}
                        onClick={cancel}
                    >
                        Ok!
                    </button>
                )}
            </div>
        </div>
    )
}

export default Projects
