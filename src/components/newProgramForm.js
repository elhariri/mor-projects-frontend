import React from "react"

import { useQuery } from "@apollo/react-hooks"
import { useForm, Controller } from "react-hook-form"

import Select from "react-select"

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Upload from "./upload"

import { GET_ALL_USERS } from "./queries/queries"

import { uploadFile, CloseButton } from "./utils"

import globalStyles from "../styles/global.module.css"
import taskStyles from "./task.module.css"

export default ({ createProgram, onCancel }) => {
    const { data: users } = useQuery(GET_ALL_USERS)
    const { register, handleSubmit, control } = useForm()
    const addClick = async (data) => {
        data.cover = await uploadFile(data.cover)
        if (!data.cover) delete data.cover
        createProgram({ variables: { data: data } })
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
                        Create a new program
                    </span>
                    <p style={{ marginBottom: "60px", fontSize: "1.8rem" }}>
                        Hmmm you're doing just fine.
                    </p>
                    <form
                        id="new-program-form"
                        onSubmit={handleSubmit(addClick)}
                        className={`${globalStyles.rowFlex} ${globalStyles.formContainer}`}
                        autoComplete="off"
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
                            Task cover
                            <Controller
                                as={Upload}
                                control={control}
                                valueName="selected" // DateSelect value's name is selected
                                onChange={([selected]) => selected}
                                defaultValue={[]}
                                name="cover"
                                className={globalStyles.input}
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
