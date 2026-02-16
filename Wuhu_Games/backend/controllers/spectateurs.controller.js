import * as service from "../services/spectateurs.services.js"

export async function getSpectateurs(req, res, next) {
  try {
    const result = await service.getSpectateurs()
    res.status(result.status).json(result)
  } catch (err) {
    next(err)
  }
}

export async function getSpectateursForCompet(req, res, next) {
  try {
    const { titre, jour, heure } = req.params
    const result = await service.getSpectateursForCompet(titre, jour, heure)
    res.status(result.status).json(result)
  } catch (err) {
    next(err)
  }
}

export async function getNumeroSpectateur(req, res, next) {
  try {
    const { titre, jour, heure, username } = req.params
    const result = await service.getNumeroSpectateur(titre, jour, heure, username)
    res.status(result.status).json(result)
  } catch (err) {
    next(err)
  }
}

export async function inscrireSpectateur(req, res, next) {
  try {
    const result = await service.inscrireSpectateur(req.body)
    res.status(result.status).json(result)
  } catch (err) {
    next(err)
  }
}

export async function desinscrireSpectateur(req, res, next) {
  try {
    const result = await service.desinscrireSpectateur(req.body)
    res.status(result.status).json(result)
  } catch (err) {
    next(err)
  }
}
