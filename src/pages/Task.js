import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery, useMutation } from "@apollo/react-hooks"

import _ from "lodash"
import Dante from "dante-unsafe"
import chroma from "chroma-js"
import Cookies from "js-cookie"

import { Loader, convertDate, Menu } from "../components/utils"
import { Check } from "../components/icons/utils"

import { UPDATE_TASK, GET_TASK } from "../components/queries/queries"

import taskStyles from "../components/task.module.css"
import globalStyles from "../styles/global.module.css"

const Task = () => {
    let { id } = useParams()
    const [note, setNotes] = useState({})
    const { loading, error, data: { task } = {}, networkStatus } = useQuery(
        GET_TASK,
        {
            variables: { id: id },
            notifyOnNetworkStatusChange: true,
        }
    )

    const [updateTask, { loading: updateLoading }] = useMutation(UPDATE_TASK, {
        onError: (err) => {
            console.log(err)
        },
    })

    const handleAddNote = async () => {
        const notes = await _.cloneDeep(task.notes)
            .map((el) => {
                el.user = el.user.id
                el.created = new Date(el.created)
                delete el.__typename
                return el
            })
            .concat({
                user: JSON.parse(Cookies.get("user")).id.toString(),
                note: note,
                created: new Date(),
            })

        updateTask({
            variables: {
                id: id,
                data: {
                    notes: notes,
                },
            },
        })
    }

    if (loading || networkStatus === 4) return <Loader />
    if (error) return <p>Error :(</p>
    return (
        <div
            style={{
                flex: 1,
                padding: "65px 10px",
                margin: "0 auto",
                width: "900px",
                height: "100vh",
                overflow: "scroll",
            }}
            className={globalStyles.columnFlex}
        >
            <div
                style={{
                    marginBottom: "30px",
                    justifyContent: "space-between",
                }}
                className={`${globalStyles.rowFlex} `}
            >
                <Admin admin={task.admin} created_at={task.created_at} />
                <Menu menuOptions={[]} style={{ margin: "auto 0" }} />
            </div>

            {!!task.cover && (
                <div
                    className={`${taskStyles.taskImg} ${taskStyles.bigTaskImg}`}
                    style={{
                        background:
                            " url(" +
                            process.env.REACT_APP_BACKEND_URL +
                            task.cover.url +
                            ")",
                        backgroundSize: "cover",
                        marginBottom: "20px",
                        borderRadius: "5px",
                    }}
                ></div>
            )}

            <h1 style={{ fontSize: "4rem", paddingBottom: 0 }}>{task.title}</h1>
            <Tags tags={task.tags} stage={task.stage} />
            {!!task.description && (
                <>
                    <span className={globalStyles.formSeparator}></span>
                    <p style={{ /* color: "#484a4b", */ fontSize: "1.8rem" }}>
                        {task.description}
                    </p>
                </>
            )}
            <span className={globalStyles.formSeparator}></span>
            {task.notes.map((el, i) => (
                <div key={i} className={globalStyles.columnFlex}>
                    <Dante content={el.note} read_only={true} />
                </div>
            ))}
            <div
                className={globalStyles.columnFlex}
                style={{
                    padding: "5px",
                    border: "1px solid #ebecef",
                    borderRadius: "5px",
                }}
            >
                <Admin
                    admin={JSON.parse(Cookies.get("user"))}
                    style={{ marginBottom: "20px" }}
                />
                {!updateLoading && (
                    <Dante
                        body_placeholder="Add a note..."
                        data_storage={{
                            save_handler: ({ editor }) => {
                                setNotes(editor.emitSerializedOutput())
                            },
                        }}
                    />
                )}
                <button
                    style={{ marginTop: "20px" }}
                    className={globalStyles.bigFormButton}
                    onClick={handleAddNote}
                >
                    Add!
                </button>
            </div>
        </div>
    )
}

const Admin = ({ admin, created_at, style }) => {
    if (!!admin)
        return (
            <div className={globalStyles.rowFlex} style={style}>
                {!!admin.photo && (
                    <div
                        style={{
                            background:
                                " url(" +
                                process.env.REACT_APP_BACKEND_URL +
                                (admin.photo.url || admin.photo) +
                                ")",
                            backgroundSize: "cover",
                            width: "50px",
                            height: "50px",
                            borderRadius: "40px",
                            marginRight: "10px",
                        }}
                    ></div>
                )}
                <div className={globalStyles.columnFlex}>
                    <div
                        style={{
                            margin: "auto 0 5px 0",
                            fontSize: "1.8rem",
                            fontWeight: "600",
                        }}
                    >
                        {admin.username}
                    </div>

                    <span
                        style={{
                            margin: "5px 0 auto 0",
                            fontSize: "1.3rem",
                            color: "var(--light-dark-font)",
                        }}
                    >
                        {!!created_at && convertDate(created_at)}
                    </span>
                </div>
            </div>
        )
    return null
}

const Tags = ({
    tags /* 
    setAddTag, */,
    stage,
    /* phaseStage, */
    /* isMainPhase,
    addTag,
    id,
    updateTask, */
}) => {
    /* const [offset, setOffset] = useState({})
    const addTagClick = (e) => {
        e.stopPropagation()
        e.preventDefault()
        setOffset(e.target.getBoundingClientRect())
        setAddTag(true)
    } */

    return (
        <div className={globalStyles.rowFlex}>
            {stage === "done" /*  && phaseStage !== "done" */ && (
                <span
                    className={taskStyles.tag}
                    style={{
                        background: chroma("#53d769").alpha(0.15).css(),
                        color: "var(--green-color)",
                        fontWeight: "700",
                        fontSize: "1.6rem",
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
                                fontSize: "1.6rem",
                            }}
                            key={i}
                        >
                            {el.tag}
                        </span>
                    )
                })}
            {/* {phaseStage !== "done" && (
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
            )} */}
        </div>
    )
}

export default Task
