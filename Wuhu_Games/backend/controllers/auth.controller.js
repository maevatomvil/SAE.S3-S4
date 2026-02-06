import * as service from "../services/auth.services.js"





export async function login(req, res, next) {
  try {
    const result = await service.login(req.body)

    if (result.error === 0) {
      res.cookie("session", result.data.session, {
         httpOnly: true,
        sameSite: "lax"

      })
    }

    res.status(result.status).json(result)
  } catch (err) {
    next(err)
  }
}



export async function signup(req, res, next) {
  try {
    const result = await service.signup(req.body)
    res.status(result.status).json(result)
  } catch (err) {
    next(err)
  }
}

export async function checkSession(req, res, next) {
  try {
    const result = await service.checkSession(req.cookies)
    res.status(result.status).json(result)
  } catch (err) {
    next(err)
  }
}

export async function logout(req, res, next) {
  try {
    const result = await service.logout(req.cookies.session)

    res.clearCookie("session")
    res.status(result.status).json(result)
  } catch (err) {
    next(err)
  }
}
