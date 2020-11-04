import React, { useRef, useEffect, useCallback } from "react"

import { useForm, Controller } from "react-hook-form"
import Select from "react-select"

import { tagColors, colourStyles } from "../utils"

import globalStyles from "../../styles/global.module.css"

export default ({ setAddTag, tags, updateTask, id, addTag, offset }) => {
    const form = useRef(null)
    const { register, handleSubmit, control } = useForm()
    const addClick = (data) => {
        tags.push(data)

        updateTask({
            variables: {
                id: id,
                data: {
                    tags: tags.map((el) => ({ color: el.color, tag: el.tag })),
                },
            },
        })
        setAddTag(false)
    }

    const handleClickOutside = useCallback(
        (e) => {
            if (form && !form.current.contains(e.target)) {
                setAddTag(false)
            }
        },
        [setAddTag]
    )

    useEffect(() => {
        addTag && document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [addTag, handleClickOutside])

    const preventDefault = (e) => {
        e.stopPropagation()
    }

    return (
        <form
            ref={form}
            autoComplete="off"
            id="new-task-form"
            style={{ top: offset.top, left: offset.left }}
            onSubmit={handleSubmit(addClick)}
            onClick={preventDefault}
            className={`${globalStyles.columnFlex} ${globalStyles.tagForm} add-form`}
        >
            <label
                className={globalStyles.title}
                style={{ fontSize: "1.4rem" }}
                htmlFor="tag"
            >
                Tag
            </label>
            <input
                className={globalStyles.input}
                style={{ width: "auto" }}
                type="text"
                id="tag"
                name="tag"
                ref={register}
            />

            <label
                className={globalStyles.title}
                style={{ fontSize: "1.4rem" }}
                htmlFor="tag_color"
            >
                Color
            </label>
            <Controller
                as={
                    <Select
                        name="members"
                        options={tagColors}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        styles={colourStyles}
                    />
                }
                control={control}
                valueName="selected"
                onChange={([selected]) => selected.color}
                name="color"
                id="tagColor"
                className={globalStyles.input}
                placeholderText=""
            />

            <button
                type="submit"
                style={{ marginTop: "20px" }}
                className={globalStyles.bigFormButton}
            >
                Create!
            </button>
        </form>
    )
}
