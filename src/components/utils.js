import React, { useState, useEffect, useRef } from "react"

import chroma from "chroma-js"
import Cookies from "js-cookie"
import { format } from "date-fns"

import { Menu as MenuIcon, Close } from "./icons/utils"

import globalStyles from "../styles/global.module.css"
import taskStyles from "./task.module.css"

const STRAPI_URL = process.env.REACT_APP_BACKEND_URL

export const makePushRequest = async (url, method, data) => {
    const result = await fetch(STRAPI_URL + url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((res) => res)

    return result
}

export const makeUploadRequest = async (url, method, data, authToken) => {
    const result = await fetch(STRAPI_URL + url, {
        method: method,
        headers: {
            Authorization: "Bearer " + authToken,
        },
        body: data,
    })
        .then((res) => res.json())
        .then((res) => res)
        .catch(err => { console.log(err) })

    return result
}

export const makeGetRequest = async (url) => {
    const result = await fetch(STRAPI_URL + url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => res)

    return result
}

export const Menu = ({ menuOptions, style }) => {
    const [expanded, setExpansion] = useState(false)
    const menu = useRef(null)

    const handleClickOutside = (e) => {
        if (menu && !menu.current.contains(e.target)) {
            setExpansion(false)
        }
    }

    const optionClick = (e, handler) => {
        handler(e)
        setExpansion(false)
    }

    useEffect(() => {
        expanded && document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [expanded])
    return (
        <div
            ref={menu}
            className={`${taskStyles.menuIcon} ${globalStyles.columnFlex} ${expanded ? taskStyles.expandedMenuIcon : ""
                }`}
        >
            <MenuIcon
                style={{
                    flexShrink: 0,
                    width: "15px",
                    zIndex: expanded ? "5" : "4",
                }}
                onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    setExpansion(true)
                }}
            />
            <span
                className={`${taskStyles.menuOptionsContainer} ${globalStyles.columnFlex}`}
            >
                {menuOptions.map((el, i) => (
                    <button
                        key={i}
                        className={taskStyles.menuOption}
                        onClick={(e) => optionClick(e, el.handler)}
                    >
                        {el.name}
                    </button>
                ))}
            </span>
        </div>
    )
}

export const handleCardMove = (
    board,
    cardId,
    sourceLaneId,
    targetLaneId,
    position
) => {
    let sourcePhase, targetPhase
    board.phases.map((el) => {
        if (el.phase.id === sourceLaneId) {
            el.phase.tasks = el.phase.tasks.filter(
                (elem) => elem.task.id !== cardId
            )
            sourcePhase = el.phase
        }

        if (el.phase.id === targetLaneId) {
            el.phase.tasks.splice(position, 0, { task: { id: cardId } })
            targetPhase = el.phase
        }

        return el
    })

    targetPhase = {
        id: targetPhase.id,
        type: targetPhase.type,
        tasks: targetPhase.tasks.map((el) => ({ task: el.task.id })),
    }
    if (sourceLaneId !== targetLaneId) {
        sourcePhase = {
            id: sourcePhase.id,
            tasks: sourcePhase.tasks.map((el) => ({ task: el.task.id })),
        }
    }

    return [sourcePhase, targetPhase]
}

export const convertDate = (date) => {
    return format(new Date(date), "PP")
}

export const tagColors = [
    { value: "ocean", label: "Ocean", color: "#00B8D9" },
    { value: "blue", label: "Blue", color: "#0052CC" },
    { value: "purple", label: "Purple", color: "#5243AA" },
    { value: "red", label: "Red", color: "#FF5630" },
    { value: "orange", label: "Orange", color: "#FF8B00" },
    { value: "yellow", label: "Yellow", color: "#FFC400" },
    { value: "green", label: "Green", color: "#53d769" },
    { value: "forest", label: "Forest", color: "#00875A" },
    { value: "slate", label: "Slate", color: "#253858" },
    { value: "silver", label: "Silver", color: "#666666" },
]

export const criticity = [
    {
        value: 0,
        label: "Null",
    },
    {
        value: 1,
        label: "Slim",
    },
    {
        value: 2,
        label: "Moderate",
    },

    {
        value: 3,
        label: "Critical",
    },
]

export const colourStyles = {
    control: (styles, state) => ({
        ...styles,
        backgroundColor: "white",
        width: "230px",
        border: state.isFocused ? "1px solid #2684FF" : "1px solid #bfc2cb",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(data.color)
        return {
            ...styles,
            backgroundColor: isDisabled
                ? null
                : isSelected
                    ? data.color
                    : isFocused
                        ? color.alpha(0.1).css()
                        : null,
            color: isDisabled
                ? "#ccc"
                : isSelected
                    ? chroma.contrast(color, "white") > 2
                        ? "white"
                        : "black"
                    : data.color,
            cursor: isDisabled ? "not-allowed" : "default",

            ":active": {
                ...styles[":active"],
                backgroundColor:
                    !isDisabled &&
                    (isSelected ? data.color : color.alpha(0.3).css()),
            },
        }
    },
    singleValue: (styles, { data }) => {
        const color = chroma(data.color)
        return {
            ...styles,
            color: data.color,
            backgroundColor: color.alpha(0.1).css(),
            padding: "5px 10px",
            borderRadius: "5px",
        }
    },
}

export const uploadFile = async (cover) => {
    if (!!cover.length) {
        const [file] = cover

        const fileData = new FormData()
        fileData.append("files", file)
        console.log(JSON.parse(Cookies.get("user")).jwt)
        try {
            const uploadedFile = await makeUploadRequest(
                "/upload",
                "POST",
                fileData,
                JSON.parse(Cookies.get("user")).jwt
            )

            console.log(uploadFile)

            return uploadedFile[0].id
        } catch (err) {
            console.log(err)
        }

    }
    return null
}

export const Loader = () => {
    return (
        <div
            className={globalStyles.columnFlex}
            style={{
                width: "fit-content",
                height: "fit-content",
                margin: "200px auto auto auto",
            }}
        >
            <p className="spinner"></p>Loading...
        </div>
    )
}

export const customStyles = {
    control: (provided, state) => ({
        ...provided,
        border: state.isFocused ? "1px solid #2684FF" : "1px solid #bfc2cb",
    }),
    placeholder: (provided) => ({
        ...provided,
        fontSize: "1.4rem",
        fontWeight: "500",
    }),
}

export const CloseButton = ({ click }) => {
    return (
        <div onClick={click} className={globalStyles.popUpBackground}>
            <Close
                style={{
                    fill: "white",
                    width: "34px",
                    height: "34px",
                    margin: "auto",
                }}
            />
        </div>
    )
}

export const calculateProgression = (checklist) => {
    const length = checklist.length
    let doneElements = 0
    checklist.map((el) => {
        if (el.done) ++doneElements
        return el
    })

    return (100 * doneElements) / length
}

export const progressionColor = (progression) => {
    if (Math.floor(progression) <= 33) return "#FFC400"
    if (Math.floor(progression) <= 66) return "#53d769"

    return "#00875A"
}
