import React, { useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import Select from "react-select"

import Cookies from "js-cookie"

import { useMutation, useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Upload from "../upload"

import { GET_ALL_USERS } from "../queries/queries"
import { criticity, uploadFile, customStyles, CloseButton } from "../utils"

import globalStyles from "../../styles/global.module.css"
import taskStyles from "../task.module.css"

const CREATE_TASK = gql`
    mutation createTask($data: TaskInput) {
        createTask(input: { data: $data }) {
            task {
                id
                title
                description
                due
                criticity
                tags {
                    tag
                    color
                }
                cover {
                    url
                }
                members {
                    id
                    photo {
                        url
                    }
                }
                checklist {
                    title
                    done
                }
            }
        }
    }
`

export default ({ onAdd, onCancel, preCreate, showAddToMain, laneId }) => {
    const addToMain = useRef(false)
    const { data: users } = useQuery(GET_ALL_USERS)
    const [createTask] = useMutation(CREATE_TASK, {
        onCompleted: (data) => {
            const newCard = data.createTask.task
            newCard.addToMainBoard = addToMain.current
            if (addToMain.current) newCard.phases = [{ isMain: true }]
            onAdd(newCard)
        },
    })

    const { register, handleSubmit, control } = useForm()
    const addClick = async (data) => {
        if (!!preCreate) data = preCreate(data)

        data.admin = JSON.parse(Cookies.get("user")).id.toString()
        if (!!data.checklist.length) {
            data.checklist = data.checklist.split("\n").map((el) => ({
                title: el,
                done: false,
            }))
        } else {
            delete data.checklist
        }
        data.cover = await uploadFile(data.cover)
        if (!data.cover) delete data.cover
        addToMain.current = data.addToMainBoard
        delete data.addToMainBoard

        createTask({ variables: { data: data } })
    }

    return (
        <div className={`${globalStyles.popUpContainer} add-form`}>
            <div
                className={`${taskStyles.newTaskFormContainer} ${globalStyles.rowFlex}`}
            >
                <CloseButton click={onCancel} />
                <div
                    style={{ margin: "100px auto auto auto" }}
                    className={globalStyles.columnFlex}
                >
                    <span
                        className={globalStyles.title}
                        style={{ fontSize: "3rem" }}
                    >
                        Create a new task
                    </span>
                    <p style={{ marginBottom: "60px", fontSize: "1.8rem" }}>
                        Hmmm you're doing just fine.
                    </p>
                    <form
                        autoComplete="off"
                        id="new-task-form"
                        onSubmit={handleSubmit(addClick)}
                        className={`${globalStyles.rowFlex} ${globalStyles.formContainer}`}
                    >
                        <label
                            className={`${globalStyles.title} ${globalStyles.columnFlex}`}
                            style={{ fontSize: "1.6rem" }}
                            htmlFor="title_input"
                        >
                            Title
                            <input
                                className={globalStyles.input}
                                type="text"
                                id="title_input"
                                name="title"
                                ref={register}
                            />
                        </label>

                        <label
                            className={`${globalStyles.title} ${globalStyles.columnFlex}`}
                            style={{ fontSize: "1.6rem" }}
                            htmlFor="criticity"
                        >
                            Criticity
                            <Controller
                                as={
                                    <Select
                                        name="members"
                                        options={criticity}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        styles={customStyles}
                                    />
                                }
                                control={control}
                                valueName="selected"
                                onChange={([selected]) => selected.value}
                                name="criticity"
                                id="criticity"
                                className={globalStyles.input}
                                placeholderText=""
                            />
                        </label>

                        <label
                            className={`${globalStyles.title} ${globalStyles.columnFlex}`}
                            style={{ fontSize: "1.6rem" }}
                            htmlFor="due"
                        >
                            Due date
                            <Controller
                                as={DatePicker}
                                control={control}
                                valueName="selected" // DateSelect value's name is selected
                                onChange={([selected]) => selected}
                                styles={customStyles}
                                name="due"
                                className={globalStyles.input}
                                placeholderText=""
                            />
                        </label>
                        <label
                            className={`${globalStyles.title} ${globalStyles.columnFlex}`}
                            style={{ fontSize: "1.6rem" }}
                            htmlFor="teams_input"
                        >
                            Members
                            <Controller
                                as={
                                    <Select
                                        isMulti
                                        name="members"
                                        options={!!users ? users.users : []}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        styles={customStyles}
                                    />
                                }
                                control={control}
                                valueName="selected" // DateSelect value's name is selected
                                onChange={([selected]) =>
                                    selected.map((el) => el.value)
                                }
                                name="members"
                                id="members"
                                className={`${globalStyles.input} `}
                                placeholderText=""
                            />
                        </label>

                        <span className={globalStyles.formSeparator}></span>

                        <label
                            className={`${globalStyles.title} ${globalStyles.columnFlex}`}
                            style={{ fontSize: "1.6rem" }}
                            htmlFor="cover"
                        >
                            Task cover
                            <Controller
                                as={Upload}
                                control={control}
                                valueName="selected" // DateSelect value's name is selected
                                onChange={([selected]) => selected}
                                defaultValue={[]}
                                name="cover"
                                className="react-select"
                            />
                        </label>

                        <span className={globalStyles.formSeparator}></span>

                        <label
                            className={`${globalStyles.title} ${globalStyles.columnFlex}`}
                            style={{ fontSize: "1.6rem", width: "750px" }}
                            htmlFor="checklist_input"
                        >
                            Checklist
                            <textarea
                                className={globalStyles.textarea}
                                type="text"
                                rows="4"
                                id="checklist_input"
                                name="checklist"
                                ref={register}
                            />
                        </label>

                        <label
                            className={`${globalStyles.title} ${globalStyles.columnFlex}`}
                            style={{ fontSize: "1.6rem", width: "750px" }}
                            htmlFor="description_input"
                        >
                            Description
                            <textarea
                                className={globalStyles.textarea}
                                type="text"
                                rows="4"
                                id="description_input"
                                name="description"
                                ref={register}
                            />
                        </label>

                        {(!JSON.parse(Cookies.get("board")).isMain ||
                            !!showAddToMain) && (
                            <div
                                style={{
                                    justifyContent: "space-between",
                                    margin: "20px 0",
                                }}
                                className={globalStyles.rowFlex}
                            >
                                <label
                                    className={globalStyles.title}
                                    style={{ fontSize: "1.6rem" }}
                                    htmlFor="isMain"
                                >
                                    Add to main Board?
                                </label>
                                <input
                                    type="checkbox"
                                    id="isMain"
                                    name="addToMainBoard"
                                    ref={register}
                                />
                                <label
                                    className="switch-label"
                                    htmlFor="isMain"
                                >
                                    Toggle
                                </label>
                            </div>
                        )}
                        <button
                            type="submit"
                            style={{
                                marginTop: "20px",
                                width: "350px",
                                background: "rgb(20, 232, 66)",
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
