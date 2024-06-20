export const ProfileCreateReq = {
    username: true,
    password: true
}
export const ProfileCreateRes = {
    username: true,
    id: true
}

export const ProfileUpdateReq = {
    id: true,
    username: true,
    password: true
}

export const ProfileSignInReq = {
    username: true,
    password: true
}
export const ProfileSignInRes = {
    username: true,
    token: true
}