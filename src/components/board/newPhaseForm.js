import React from "react"
import { useForm, Controller } from "react-hook-form"
import Select from "react-select"

import { useMutation } from "@apollo/react-hooks"

import { tagColors, colourStyles, customStyles, CloseButton } from "../utils"
import { CREATE_PHASE } from "../queries/queries"

import globalStyles from "../../styles/global.module.css"
import taskStyles from "../task.module.css"

export default ({ onAdd, onCancel }) => {
    const { register, handleSubmit, control } = useForm()
    const [createPhase] = useMutation(CREATE_PHASE, {
        onCompleted: ({ createPhase: { phase } }) => {
            onAdd(phase)
        },
    })
    const addClick = (data) => {
        createPhase({
            variables: {
                data: data,
            },
        })
    }

    return (
        <div className={`${globalStyles.popUpContainer} add-form`}>
            <CloseButton click={onCancel} />
            <div
                className={`${taskStyles.newTaskFormContainer} ${globalStyles.rowFlex}`}
            >
                <div
                    style={{ margin: "100px auto auto auto" }}
                    className={globalStyles.columnFlex}
                >
                    <span
                        className={globalStyles.title}
                        style={{ fontSize: "3rem" }}
                    >
                        Add a new phase
                    </span>
                    <p style={{ marginBottom: "60px", fontSize: "1.8rem" }}>
                        Oooh you're being professional
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
                            htmlFor="phase_color"
                        >
                            Color
                            <Controller
                                as={
                                    <Select
                                        name="members"
                                        options={tagColors}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        styles={{
                                            ...colourStyles,
                                            ...customStyles,
                                        }}
                                    />
                                }
                                control={control}
                                valueName="selected" // DateSelect value's name is selected
                                onChange={([selected]) => selected.color}
                                name="color"
                                id="phase_color"
                                className={globalStyles.input}
                                placeholderText=""
                            />
                        </label>
                        <span className={globalStyles.formSeparator}></span>
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
