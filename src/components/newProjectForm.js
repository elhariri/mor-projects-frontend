import React from "react"

import { useQuery } from "@apollo/react-hooks"
import { useForm, Controller } from "react-hook-form"

import Select from "react-select"

import Cookies from "js-cookie"

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { GET_ALL_USERS } from "./queries/queries"
import { CloseButton, customStyles, uploadFile } from "./utils"
import Upload from "./upload"

import globalStyles from "../styles/global.module.css"
import taskStyles from "./task.module.css"

export default ({ createProject, preCreate, setNewProject }) => {
    const { data: users } = useQuery(GET_ALL_USERS)
    const { register, handleSubmit, control } = useForm()
    const addClick = async (data) => {
        if (!!preCreate) {
            data = preCreate(data)
        }
        data.admin = JSON.parse(Cookies.get("user")).id.toString()
        data.cover = await uploadFile(data.cover)
        if (!data.cover) delete data.cover
        createProject({ variables: { data: data } })
    }

    return (
        <div className={taskStyles.newTaskFormBackground}>
            <div
                className={`${taskStyles.newTaskFormContainer} ${globalStyles.rowFlex}`}
            >
                <CloseButton click={() => setNewProject(false)} />
                <div
                    style={{ margin: "auto", padding: "40px 0" }}
                    className={globalStyles.columnFlex}
                >
                    <span
                        className={globalStyles.title}
                        style={{ fontSize: "3rem" }}
                    >
                        Create a new projects
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
                            htmlFor="start_date"
                        >
                            Start date
                            <Controller
                                as={DatePicker}
                                control={control}
                                valueName="selected" // DateSelect value's name is selected
                                onChange={([selected]) => selected}
                                name="start_date"
                                className={globalStyles.input}
                                placeholderText=""
                                styles={customStyles}
                            />
                        </label>

                        <label
                            className={`${globalStyles.title} ${globalStyles.columnFlex}`}
                            style={{ fontSize: "1.6rem" }}
                            htmlFor="end_date"
                        >
                            Due date
                            <Controller
                                as={DatePicker}
                                control={control}
                                valueName="selected" // DateSelect value's name is selected
                                onChange={([selected]) => selected}
                                name="end_date"
                                className={globalStyles.input}
                                placeholderText=""
                                styles={customStyles}
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
                                id="due_date"
                                className={globalStyles.input}
                                placeholderText=""
                            />
                        </label>

                        <label
                            className={`${globalStyles.title} ${globalStyles.columnFlex}`}
                            style={{ fontSize: "1.6rem" }}
                            htmlFor="quote_input"
                        >
                            Quote
                            <textarea
                                className={globalStyles.textarea}
                                type="text"
                                rows="2"
                                id="quote_input"
                                name="quote"
                                ref={register}
                            />
                        </label>
                        <span className={globalStyles.formSeparator}></span>
                        <label
                            className={`${globalStyles.title} ${globalStyles.columnFlex}`}
                            style={{ fontSize: "1.6rem" }}
                            htmlFor="cover"
                        >
                            Project cover
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
                            style={{ fontSize: "1.6rem" }}
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
