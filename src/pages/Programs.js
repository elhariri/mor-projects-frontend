import React, { useState } from "react"
import { Link } from "react-router-dom"

import { useQuery, useMutation } from "@apollo/react-hooks"

import Cookies from "js-cookie"
import chroma from "chroma-js"

import ActionsBar from "../components/actionsBar"
import NewProgramForm from "../components/newProgramForm"

import { Menu, Loader, convertDate } from "../components/utils"
import { CircledAdd } from "../components/icons/utils"
import {
    GET_ALL_PROGRAMS_BY_USER,
    CREATE_PROGRAM,
    DELETE_PROGRAM,
} from "../components/queries/queries"

import globalStyles from "../styles/global.module.css"
import taskStyles from "../components/task.module.css"

const Programs = () => {
    const { loading, error, data, refetch, networkStatus } = useQuery(
        GET_ALL_PROGRAMS_BY_USER,
        {
            notifyOnNetworkStatusChange: true,
            variables: { id: JSON.parse(Cookies.get("user")).id },
            fetchPolicy: "network-only",
        }
    )
    const [createProgram] = useMutation(CREATE_PROGRAM, {
        onCompleted: () => {
            setNewProgram(false)
            refetch()
        },
    })
    const [deleteProgram] = useMutation(DELETE_PROGRAM, {
        onCompleted: () => {
            refetch()
        },
    })

    const [newProgram, setNewProgram] = useState(false)

    return (
        <div style={{ flex: 1, margin: "65px" }}>
            <h1>Programs</h1>
            {(() => {
                if (loading || networkStatus === 4) return <Loader />
                if (error) return <p>Error :({JSON.stringify(error)}</p>
                return (
                    <ProgramsDisplay
                        programs={data.programs}
                        setNewProgram={setNewProgram}
                        deleteProgram={deleteProgram}
                    />
                )
            })()}
            {newProgram && (
                <NewProgramForm
                    createProgram={createProgram}
                    onCancel={() => setNewProgram(false)}
                />
            )}
        </div>
    )
}

const ProgramsDisplay = ({ programs, setNewProgram, deleteProgram }) => {
    const actions = [
        {
            action: () => setNewProgram(true),
            label: "New program",
            icon: CircledAdd,
        },
    ]

    return (
        <div>
            <div
                className={`${globalStyles.rowFlex}`}
                style={{ justifyContent: "space-between" }}
            >
                <ActionsBar actions={actions} />
            </div>
            {/* <div
                className={`${globalStyles.rowFlex}`}
                style={{ justifyContent: "space-between" }}
            >
                <button onClick={() => setNewProgram(true)}>New program</button>
            </div> */}
            <div
                className={`${globalStyles.rowFlex}`}
                style={{
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                }}
            >
                {programs.map((el, i) => (
                    <SmallCard
                        key={i}
                        program={el}
                        style={{
                            background: "white",
                            marginRight: "40px",
                            width: "320px",
                        }}
                        deleteProgram={deleteProgram}
                    />
                ))}
            </div>
        </div>
    )
}

const SmallCard = ({ program, style, deleteProgram }) => {
    const userId = JSON.parse(Cookies.get("user")).id.toString()
    const deleteProgramHandler = (e) => {
        e.stopPropagation()
        e.preventDefault()

        deleteProgram({
            variables: {
                programId: program.id,
            },
        })
    }
    const menuOptions = [
        {
            name: "delete",
            handler: deleteProgramHandler,
        },
    ]
    const typeStyle =
        userId === program.admin.id
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
            to={`/Programs/${program.id}`}
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
                {!!program.cover && (
                    <div
                        className={`${taskStyles.taskImg} ${taskStyles.smallTaskImg}`}
                        style={{
                            background:
                                "url(" +
                                process.env.REACT_APP_BACKEND_URL +
                                program.cover.url +
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
                        {program.title}
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
                            {userId === program.admin.id ? "admin" : "guest"}
                        </span>
                    </h1>
                    <Menu menuOptions={menuOptions} />
                </div>
                {!!program.description && <p>{program.description}</p>}
                {!!program.due_date && (
                    <p
                        style={{
                            margin: "5px 0 0 0",
                            padding: "0",
                        }}
                    >
                        {convertDate(program.due_date)}
                    </p>
                )}
            </div>
        </Link>
    )
}

export default Programs
