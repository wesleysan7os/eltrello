import { NextFunction, Request, Response } from "express";
import UserModel from '../models/user'
import { UserDocument } from "../types/user.interface";
import { Error } from 'mongoose'
import jwt from 'jsonwebtoken'
import { secret } from '../config'

export const register = async(req: Request, res: Response, next: NextFunction) => {
  const normalizedUser = (user: UserDocument) => {
    const token = jwt.sign({id: user.id, email: user.email}, secret)
    return {
      id: user._id,
      email: user.email,
      username: user.username,
      token
    }
  }
  
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