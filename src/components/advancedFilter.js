import React, { useState } from "react"

import { useApolloClient, useMutation } from "@apollo/react-hooks"
import { GET_REDUCED_BOARD, DELETE_BOARD } from "./queries/queries"

import Cookies from "js-cookie"

import { Add, Warning } from "./icons/utils"

import globalStyles from "../styles/global.module.css"
import filterStyles from "../styles/filter.module.css"

const AdvancedFilter = ({
    filters,
    activeFilter,
    setActiveFilter,
    setShownForm,
    canAdd = true,
    canDelete = true,
    switchFilter = true,
    style,
}) => {
    const client = useApolloClient()
    const [popUp, setPopUp] = useState({ show: false, component: null })
    const [deletedBoards, setDeletedBoards] = useState([])
    const [deleteBoard] = useMutation(DELETE_BOARD, {
        ignoreResults: true,
        onCompleted: ({
            deleteBoard: {
                board: { id },
            },
        }) => setDeletedBoards((prev) => prev.concat(id)),
    })

    const getServerBoard = async (id) => {
        const {
            data: { board: serverBoard },
        } = await client.query({
            fetchPolicy: "network-only",
            query: GET_REDUCED_BOARD,
            variables: { id: id },
            ignoreResults: true,
        })

        return serverBoard
    }

    const setActiveFilterWithCookie = (el) => {
        Cookies.set("board", {
            id: el.id,
            isMain: el.isMain,
        })
        setActiveFilter(el)
    }
    const deleteClick = async (e, id) => {
        e.stopPropagation()
        const board = await getServerBoard(id)

        !!board.phases.length &&
            setPopUp({ show: true, component: BoardNonEmpty })
        !board.phases.length &&
            deleteBoard({
                variables: { id: id },
            })
    }

    return (
        <div
            style={{ marginBottom: "40px", ...style }}
            className={globalStyles.rowFlex}
        >
            <div
                style={{ alignItems: "center" }}
                className={globalStyles.rowFlex}
            >
                {filters
                    .filter((el) => !deletedBoards.includes(el.id))
                    .map((el, index) => {
                        return (
                            <button
                                key={index}
                                onClick={() => setActiveFilterWithCookie(el)}
                                style={{ marginRight: "20px" }}
                                className={`${filterStyles.filter} ${
                                    el.id === activeFilter
                                        ? filterStyles.activeFilter
                                        : ""
                                }`}
                            >
                                {el.title}{" "}
                                <span
                                    onClick={(e) => deleteClick(e, el.id)}
                                    className={filterStyles.filterDelete}
                                    style={
                                        !!el.isMain || !canDelete
                                            ? {
                                                  visibility: "hidden",
                                              }
                                            : {}
                                    }
                                >
                                    x
                                </span>
                            </button>
                        )
                    })}
                {canAdd && (
                    <Add
                        onClick={() => setShownForm("create_board")}
                        className={globalStyles.hoverableIcon}
                    />
                )}
                {popUp.show && <PopUp action={setPopUp} child={popUp} />}
            </div>
            {switchFilter && (
                <div
                    className={`${globalStyles.rowFlex} ${filterStyles.filter} ${filterStyles.filterBy}`}
                >
                    <div className={globalStyles.rowFlex}>
                        <input type="checkbox" id="switch" />
                        <label className="switch-label" htmlFor="switch">
                            Toggle
                        </label>
                    </div>
                </div>
            )}
        </div>
    )
}

const PopUp = ({ action, child }) => {
    return (
        <div className={`${globalStyles.popUpContainer} add-form`}>
            <div
                onClick={() => action({ show: false })}
                className={globalStyles.popUpBackground}
            ></div>
            <child.component action={action} />
        </div>
    )
}

const BoardNonEmpty = ({ action }) => (
    <div
        className={`${globalStyles.messageConatiner} ${globalStyles.columnFlex}`}
    >
        <Warning
            style={{ fill: "red", width: "80px", margin: "0 auto 20px auto" }}
        />
        <span>
            please Make sure that the board is empty before deleting it.
        </span>
        <button
            onClick={() => action({ show: false })}
            style={{ backgroundColor: "red", marginTop: "40px" }}
            className={globalStyles.bigFormButton}
        >
            Ok
        </button>
    </div>
)

export default AdvancedFilter
