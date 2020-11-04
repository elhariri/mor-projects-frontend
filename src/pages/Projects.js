import React, { useState } from "react"
import { Link } from "react-router-dom"

import { useQuery, useMutation } from "@apollo/react-hooks"

import _ from "lodash"
import Cookies from "js-cookie"
import chroma from "chroma-js"

import Filter from "../components/advancedFilter"
import ActionsBar from "../components/actionsBar"
import NewProjectForm from "../components/newProjectForm"

import { Menu, Loader, convertDate } from "../components/utils"
import { CircledAdd } from "../components/icons/utils"
import {
    GET_ALL_PROJECTS_BY_USER,
    CREATE_PROJECT,
    DELETE_PROJECT,
} from "../components/queries/queries"

import globalStyles from "../styles/global.module.css"
import taskStyles from "../components/task.module.css"

const Projects = ({
    addProjects = true,
    containerStyle = {},
    filterContainerStyle = {},
}) => {
    const [projectsByPrograms, setProjectsByPrograms] = useState(null)
    const [isEmpty, setIsEmpty] = useState(true)
    const [programs, setPrograms] = useState(null)
    const [activeProgram, setActiveProgram] = useState(null)

    const { loading, error, refetch, networkStatus } = useQuery(
        GET_ALL_PROJECTS_BY_USER,
        {
            notifyOnNetworkStatusChange: true,
            variables: { id: JSON.parse(Cookies.get("user")).id },
            fetchPolicy: "network-only",
            onCompleted: (data) => {
                if (!!data.projects.length) {
                    const projects = _.cloneDeep(data.projects)

                    setProjectsByPrograms(
                        _.assign(
                            { "-1": projects },
                            _.groupBy(projects, (el) => {
                                if (!!el.program) return el.program.id
                                return "0"
                            })
                        )
                    )
                    const programs = _.uniqBy(
                        projects.map((el) => {
                            if (!!el.program) return el.program
                            return { id: "0", title: "unassigned" }
                        }),
                        (el) => {
                            if (!!el) return el.id
                            return "0"
                        }
                    )

                    programs.unshift({ id: "-1", title: "all" })
                    setPrograms(programs)
                    setActiveProgram(programs[0])
                    setIsEmpty(false)
                } else {
                    setIsEmpty(true)
                }
            },
        }
    )
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

    const actions = [
        {
            action: () => setNewProject(true),
            label: "New project",
            icon: CircledAdd,
        },
    ]

    return (
        <div style={{ flex: 1, margin: "65px", ...containerStyle }}>
            <h1>Projects</h1>
            {(() => {
                if (loading || networkStatus === 4) return <Loader />
                if (error) return <p>Error :({JSON.stringify(error)}</p>

                return (
                    <div>
                        <div
                            className={`${globalStyles.rowFlex}`}
                            style={{
                                justifyContent: "space-between",
                                ...filterContainerStyle,
                            }}
                        >
                            {!!activeProgram && (
                                <Filter
                                    filters={programs}
                                    activeFilter={activeProgram.id}
                                    setActiveFilter={setActiveProgram}
                                    canAdd={false}
                                    canDelete={false}
                                    switchFilter={false}
                                />
                            )}
                            {addProjects && <ActionsBar actions={actions} />}
                        </div>

                        <div
                            className={`${globalStyles.rowFlex}`}
                            style={{
                                justifyContent: "flex-start",
                                flexWrap: "wrap",
                            }}
                        >
                            {isEmpty ? (
                                <p>Empty</p>
                            ) : (
                                projectsByPrograms[activeProgram.id].map(
                                    (el, i) => (
                                        <SmallCard
                                            key={i}
                                            project={el}
                                            style={{
                                                background: "white",
                                                marginRight: "40px",
                                                width: "320px",
                                            }}
                                            deleteProject={deleteProject}
                                        />
                                    )
                                )
                            )}
                        </div>
                    </div>
                )
            })()}
            {newProject && (
                <NewProjectForm
                    createProject={createProject}
                    setNewProject={setNewProject}
                />
            )}
        </div>
    )
}

const SmallCard = ({ project, style, deleteProject }) => {
    const userId = JSON.parse(Cookies.get("user")).id.toString()
    const deleteProjectHandler = (e) => {
        e.stopPropagation()
        e.preventDefault()

        deleteProject({
            variables: {
                projectId: project.id,
            },
        })
    }
    const menuOptions = [
        {
            name: "delete",
            handler: deleteProjectHandler,
        },
    ]
    const typeStyle =
        userId === project.admin.id
            ? {
                  background: chroma("#0052CC").alpha(0.15).css(),
                  color: "#0052CC",
              }
            : {
                  background: chroma("#FF8B00").alpha(0.15).css(),
                  color: "#FF8B00",
              }
    return (
        <Link
            to={`/Projects/${project.id}`}
            style={style}
            className={`${globalStyles.smallProjectCard} ${globalStyles.rowFlex}`}
        >
            <div
                className={globalStyles.columnFlex}
                style={{
                    margin: "5px",
                    flex: 1,
                }}
            >
                {!!project.cover && (
                    <div
                        className={`${taskStyles.taskImg} ${taskStyles.smallTaskImg}`}
                        style={{
                            backgroundImage:
                                "url(" +
                                process.env.REACT_APP_BACKEND_URL +
                                project.cover.url +
                                ")",
                            backgroundSize: "cover",
                        }}
                    ></div>
                )}
                <div
                    style={{
                        justifyContent: "space-between",
                    }}
                    className={`${globalStyles.rowFlex} `}
                >
                    <h1
                        style={{
                            fontStyle: "normal",
                            fontWeight: "700",
                            fontSize: "18px",
                            margin: "0 0 auto 0",
                            padding: "0",
                            color: "var(--dark-font)",
                        }}
                    >
                        {project.title}
                        <span
                            style={{
                                fontSize: "16px",
                                fontWeight: "500",
                                padding: "5px",
                                borderRadius: "5px",
                                marginLeft: "5px",
                                ...typeStyle,
                            }}
                        >
                            {userId === project.admin.id ? "admin" : "guest"}
                        </span>
                    </h1>
                    <Menu menuOptions={menuOptions} />
                </div>
                {!!project.description && <p>{project.description}</p>}
                {!!project.due_date && (
                    <p
                        style={{
                            margin: "5px 0 0 0",
                            padding: "0",
                        }}
                    >
                        {convertDate(project.due_date)}
                    </p>
                )}
            </div>
        </Link>
    )
}

export default Projects
