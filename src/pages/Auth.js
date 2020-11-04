import React, { useState } from "react"
import { useForm } from "react-hook-form"

import Cookies from "js-cookie"

import { makePushRequest } from "../components/utils"

import Bg from "../images/bg.png"

import globalStyles from "../styles/global.module.css"
import taskStyles from "../components/task.module.css"

const Auth = ({ setAuth }) => {
    const [signIn, setSignIn] = useState(true)
    const [serverError, setError] = useState(false)
    const { register, handleSubmit } = useForm()

    const addClick = async (data) => {
        data.role = "authenticated"

        makePushRequest(`/auth/local${signIn ? `` : `/register`}`, "POST", data)
            .then((res) => {
                if (!!res) {
                    let { id, username, email, photo } = res.user
                    photo = photo || {}
                    Cookies.set(
                        "user",
                        {
                            id: id,
                            username: username,
                            email: email,
                            photo: photo.url,
                            jwt: res.jwt,
                        },
                        { expires: 2 }
                    )

                    setAuth(true)
                }
            })
            .catch((err) => {
                console.log(err)
                setError(err)
            })
    }
    if (serverError) return <p>{}</p>
    return (
        <div style={{ left: 0 }} className={taskStyles.newTaskFormBackground}>
            <img src={Bg} alt="bg" />
            <div
                className={`${taskStyles.newTaskFormContainer} ${globalStyles.rowFlex}`}
            >
                {signIn ? (
                    <SignIn
                        handleSubmit={handleSubmit}
                        register={register}
                        addClick={addClick}
                        setSignIn={setSignIn}
                    />
                ) : (
                        <SignUp
                            handleSubmit={handleSubmit}
                            register={register}
                            addClick={addClick}
                            setSignIn={setSignIn}
                        />
                    )}
            </div>
        </div>
    )
}

const SignIn = ({ handleSubmit, register, addClick, setSignIn }) => {
    return (
        <div
            style={{ margin: "200px auto auto auto" }}
            className={globalStyles.columnFlex}
        >
            <span className={globalStyles.title}>Welcome</span>
            <p style={{ marginBottom: "50px" }}>
                Please fill the form below if you're already a member
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
                    htmlFor="email_input"
                >
                    E-mail
                </label>
                <input
                    className={globalStyles.input}
                    type="text"
                    id="email_input"
                    name="identifier"
                    ref={register}
                />

                <label
                    className={globalStyles.title}
                    style={{ fontSize: "1.4rem" }}
                    htmlFor="password"
                >
                    Password
                </label>
                <input
                    className={globalStyles.input}
                    type="password"
                    id="password"
                    name="password"
                    ref={register}
                />

                <button
                    type="submit"
                    style={{ marginTop: "20px" }}
                    className={globalStyles.bigFormButton}
                >
                    Create!
                </button>
            </form>
            <p style={{ textAlign: "center" }}>
                Not yet a member?{" "}
                <button
                    onClick={() => setSignIn(false)}
                    style={{ color: "var(--main-color)" }}
                >
                    Sign up here
                </button>
            </p>
        </div>
    )
}

const SignUp = ({ handleSubmit, register, addClick, setSignIn }) => {
    return (
        <div
            style={{ margin: "200px auto auto auto" }}
            className={globalStyles.columnFlex}
        >
            <span className={globalStyles.title}>Welcome</span>
            <p style={{ marginBottom: "50px" }}>
                Please fill fill the form below if you're a new member
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
                    htmlFor="username_input"
                >
                    Username
                </label>
                <input
                    className={globalStyles.input}
                    type="text"
                    id="username_input"
                    name="username"
                    ref={register}
                />
                <label
                    className={globalStyles.title}
                    style={{ fontSize: "1.4rem" }}
                    htmlFor="email_input"
                >
                    E-mail
                </label>
                <input
                    className={globalStyles.input}
                    type="text"
                    id="email_input"
                    name="email"
                    ref={register}
                />

                <label
                    className={globalStyles.title}
                    style={{ fontSize: "1.4rem" }}
                    htmlFor="password"
                >
                    Password
                </label>
                <input
                    className={globalStyles.input}
                    type="password"
                    id="password"
                    name="password"
                    ref={register}
                />

                <button
                    type="submit"
                    style={{ marginTop: "20px" }}
                    className={globalStyles.bigFormButton}
                >
                    Create!
                </button>
            </form>
            <p style={{ textAlign: "center" }}>
                Already a member?{" "}
                <button
                    onClick={() => setSignIn(true)}
                    style={{ color: "var(--main-color)" }}
                >
                    Sign in.
                </button>
            </p>
        </div>
    )
}

export default Auth
