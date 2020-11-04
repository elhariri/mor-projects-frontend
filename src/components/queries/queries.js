import { gql } from "apollo-boost"

export const GET_ALL_USERS = gql`
    {
        users {
            value: id
            label: username
        }
    }
`

export const GET_ALL_PROGRAMS_BY_USER = gql`
    query getPrograms($id: ID!) {
        programs(where: { members_contains: $id }) {
            title
            id
            description
            members {
                id
            }
            admin {
                id
            }
            cover {
                url
            }
        }
    }
`

export const DELETE_PROGRAM = gql`
    mutation deleteProgramDefinitely($programId: ID!) {
        deleteProgramDefinitely(programId: $programId) {
            id
        }
    }
`

export const GET_ALL_PROJECTS_BY_PROGRAM_BY_USER = gql`
    query getProjects($id: ID!, $programId: ID!) {
        projects(where: { members_contains: $id, program: $programId }) {
            title
            id
            description
            end_date
            members {
                id
            }
            admin {
                id
            }
            cover {
                url
            }
        }
        program(id: $programId) {
            title
        }
    }
`

export const GET_ALL_PROJECTS_BY_USER = gql`
    query getProjects($id: ID!) {
        projects(where: { members_contains: $id }) {
            title
            id
            description
            members {
                id
            }
            admin {
                id
            }
            cover {
                url
            }
            program {
                id
                title
            }
        }
    }
`

export const GET_ALL_PROJECTS_WITH_NO_PROGRAM_BY_ADMIN = gql`
    query getProjects($id: ID!) {
        projects(where: { admin: $id, program_null: true }) {
            title
            id
            description
            members {
                id
            }
            admin {
                id
            }
            cover {
                url
            }
        }
    }
`

export const CREATE_PROGRAM = gql`
    mutation CreateProgram($data: ProgramInput!) {
        createProgram(input: { data: $data }) {
            program {
                id
                title
            }
        }
    }
`

export const UPDATE_PROGRAM = gql`
    mutation updateProgram($id: ID!, $data: editProgramInput) {
        updateProgram(input: { where: { id: $id }, data: $data }) {
            program {
                id
                title
                projects {
                    id
                    title
                }
            }
        }
    }
`

export const CREATE_PROJECT = gql`
    mutation CreateProject($data: ProjectInput!) {
        createProject(input: { data: $data }) {
            project {
                id
                title
                description
            }
        }
    }
`

export const GET_USER_PROJECTS = gql`
    query getUserProjects($userId: ID!) {
        projects(where: { members_contains: $userId }) {
            title
            members {
                username
            }
        }
    }
`

export const GET_PROJECT = gql`
    query getProject($id: ID!) {
        project(id: $id) {
            id
            title
            quote
            boards {
                title
                id
                isMain
            }
            program {
                id
                title
            }
        }
    }
`

export const UPDATE_PROJECT = gql`
    mutation updateProject($id: ID!, $data: editProjectInput) {
        updateProject(input: { where: { id: $id }, data: $data }) {
            project {
                id
                title
                boards {
                    title
                    id
                    isMain
                }
            }
        }
    }
`

export const DELETE_PROJECT = gql`
    mutation deleteProjectDefinitely($projectId: ID!) {
        deleteProjectDefinitely(projectId: $projectId) {
            id
        }
    }
`

export const GET_BOARD = gql`
    query getBoard($id: ID!) {
        board(id: $id) {
            title
            id
            lanes: phases {
                phase {
                    id
                    title
                    color
                    type
                    isMain
                    cards: tasks {
                        card: task {
                            id
                            title
                            due
                            description
                            criticity
                            stage
                            tags {
                                tag
                                color
                            }
                            phases {
                                isMain
                            }
                            cover {
                                url
                            }
                            members {
                                username
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
            }
        }
    }
`

export const GET_REDUCED_BOARD = gql`
    query getBoard($id: ID!) {
        board(id: $id) {
            title
            id
            phases {
                phase {
                    id
                    type
                    tasks {
                        task {
                            id
                        }
                    }
                }
            }
        }
    }
`

export const UPDATE_BOARD = gql`
    mutation updateBoard($id: ID!, $data: editBoardInput) {
        updateBoard(input: { where: { id: $id }, data: $data }) {
            board {
                title
                id
            }
        }
    }
`

export const DELETE_BOARD = gql`
    mutation deleteBoard($id: ID!) {
        deleteBoard(input: { where: { id: $id } }) {
            board {
                id
            }
        }
    }
`

export const CREATE_PHASE_IN_BOARD = gql`
    mutation createPhase($id: ID!, $phaseId: ID!, $data: PhaseInput!) {
        createPhaseInBoard(boardId: $id, phaseId: $phaseId, phase: $data) {
            title
        }
    }
`

export const CREATE_PHASE = gql`
    mutation createPhase($data: PhaseInput!) {
        createPhase(input: { data: $data }) {
            phase {
                id
                title
                description
                color
            }
        }
    }
`

export const UPDATE_PHASE = gql`
    mutation updatePhase($id: ID!, $data: editPhaseInput) {
        updatePhase(input: { where: { id: $id }, data: $data }) {
            phase {
                id
            }
        }
    }
`

export const DELETE_PHASE = gql`
    mutation deleteLane($boardId: ID!, $phaseId: ID!) {
        deleteLaneFromBoard(boardId: $boardId, phaseId: $phaseId) {
            title
        }
    }
`

export const GET_USER_TASKS = gql`
    query($userId: ID!) {
        tasks(where: { members_contains: $userId }) {
            title
            project {
                title
            }
            members {
                username
            }
        }
    }
`

export const GET_USER_TASKS_BY_STAGE = gql`
    query($userId: ID!, $stage: taskStage!) {
        tasks(where: { members_contains: $userId, stage: $stage }) {
            id
            title
            due
            phases {
                id
                isMain
                board {
                    id
                }
            }
            project {
                id
                title
            }
        }
    }
`

export const CREATE_TASK_IN_PHASE = gql`
    mutation createTask(
        $phaseId: ID!
        $taskId: ID!
        $addToMain: Boolean
        $mainBoard: ID!
        $projectId: ID!
    ) {
        createTaskInPhase(
            phaseId: $phaseId
            taskId: $taskId
            addToMain: $addToMain
            mainBoard: $mainBoard
            projectId: $projectId
        ) {
            title
        }
    }
`

export const GET_TASK = gql`
    query getTask($id: ID!) {
        task(id: $id) {
            id
            title
            stage
            description
            tags {
                tag
                color
            }
            due
            created_at
            members {
                username
            }
            admin {
                username
                photo {
                    url
                }
            }
            cover {
                url
            }
            notes {
                user {
                    id
                    username
                    photo {
                        url
                    }
                }
                note
                created
            }
        }
    }
`

export const UPDATE_TASK = gql`
    mutation updateTask($id: ID!, $data: editTaskInput) {
        updateTask(input: { where: { id: $id }, data: $data }) {
            task {
                id
                title
                stage
                description
                tags {
                    tag
                    color
                }
                due
                created_at
                members {
                    username
                }
                admin {
                    username
                    photo {
                        url
                    }
                }
                cover {
                    url
                }
                notes {
                    user {
                        id
                        username
                        photo {
                            url
                        }
                    }
                    note
                    created
                }
            }
        }
    }
`

export const ADD_TASK_TO_MAIN = gql`
    mutation addTaskToMain($taskId: ID!, $phaseId: ID!) {
        addTaskToMain(taskId: $taskId, phaseId: $phaseId) {
            id
        }
    }
`

export const ADD_TASK_TO_PROJECT_MAIN = gql`
    mutation addTaskToProjectMain($taskId: ID!, $projectId: ID!) {
        addTaskToProjectMain(taskId: $taskId, projectId: $projectId) {
            id
        }
    }
`

export const UPDATE_TASK_TO_DONE = gql`
    mutation changeTaskStage($taskId: ID!, $boardId: ID!) {
        changeTaskStage(taskId: $taskId, boardId: $boardId) {
            id
        }
    }
`

export const DELETE_TASK = gql`
    mutation deleteTask($id: ID!) {
        deleteTask(input: { where: { id: $id } }) {
            task {
                title
            }
        }
    }
`

export const CUSTOM_DELETE_TASK = gql`
    mutation customDeleteTask($phaseId: ID!, $taskId: ID!) {
        customDeleteTask(phaseId: $phaseId, taskId: $taskId) {
            title
        }
    }
`
