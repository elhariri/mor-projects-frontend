import React from "react"
import { useForm } from "react-hook-form"

import { useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"

import { CloseButton } from "../utils"

import globalStyles from "../../styles/global.module.css"
import taskStyles from "../task.module.css"

const CREATE_BOARD = gql`
    mutation createBoard($title: String) {
        createBoard(input: { data: { title: $title } }) {
            board {
                id
                title
                isMain
            }
        }
    }
`

export default ({ setShownForm, updateProject, project }) => {
    const { register, handleSubmit } = useForm()
    const [createBoard] = useMutation(CREATE_BOARD, {
        ignoreResults: true,
        onCompleted: (data) => {
            project.boards.push(data.createBoard.board)
            const newProject = {
                boards: project.boards.map((el) => el.id),
            }

            updateProject({
                variables: {
                    id: project.id,
                    data: newProject,
                },
            })
            setShownForm("")
        },
    })
    const addClick = (data) => {
        createBoard({ variables: { title: data.title } })
    }

    return (
        <div className={`${globalStyles.popUpContainer} add-form`}>
            <CloseButton click={() => setShownForm("")} />
            <div
                className={`${taskStyles.newTaskFormContainer} ${globalStyles.rowFlex}`}
            >
                <div
                    style={{ margin: "200px auto auto auto" }}
                    className={globalStyles.columnFlex}
                >
                    <span className={globalStyles.title}>Add a new board</span>
                    <p style={{ marginBottom: "60px" }}>
                        Oooh you're being professional
                    </p>
                    <form
                        autoComplete="off"
                        id="new-task-form"
                        onSubmit={handleSubmit(addClick)}
                        className={globalStyles.columnFlex}
                    >
                        <label
                            className={globalStyles.title}
                            style={{ fontSize: "1.4rem" }}
                            htmlFor="title_input"
                        >
                            Title
                        </label>
                        <input
                            className={globalStyles.input}
                            type="text"
                            id="title_input"
                            name="title"
                            ref={register}
                        />
                        <button
                            type="submit"
                            style={{
                                width: "350px",
                                background: "rgb(20, 232, 66)",
                                marginTop: "20px",
                            }}
                            className={globalStyles.bigFormButton}
                        >
                            Create!
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
