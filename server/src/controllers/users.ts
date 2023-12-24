import { NextFunction, Request, Response } from "express";
import UserModel from '../models/user'
import { UserDocument } from "../types/user.interface";
import { Error } from 'mongoose'
import jwt from 'jsonwebtoken'
import { secret } from '../config'
import { ExpressRequestInterface } from "../types/expressRequest.interface";

const normalizedUser = (user: UserDocument) => {
  const token = jwt.sign({id: user.id, email: user.email}, secret)
  return {
    id: user._id,
    email: user.email,
    username: user.username,
    token: `Bearer ${token}`
  }
}

export const register = async(req: Request, res: Response, next: NextFunction) => {  
  try {
    const newUser = new UserModel({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    })
    const savedUser = await newUser.save()
    res.send(normalizedUser(savedUser))

  } catch (err) {
    if (err instanceof Error.ValidationError) {
      const messages = Object.values(err.errors).map((err) => err.message)
      return res.status(422).json(messages)
    }
    next(err)
  }
}

export const retrieveAll = async(req: Request, res: Response) => {
  const allUsers = await UserModel.find()
  res.send(allUsers)
}

export const login = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email
    }).select('password');

    const erros = { emailOrPassword: 'Invalid e-mail or password'}
    const passwordMatch = await user?.validatePassword(req.body.password)

    if (!user || !passwordMatch) return res.status(422).json(erros)
    res.send(normalizedUser(user))

  } catch (err) {
    next(err)
  }
}

export const currentUser = async(req: ExpressRequestInterface, res: Response) => {
  if (!req.user) return res.sendStatus(401)
  res.send(normalizedUser(req.user))
}