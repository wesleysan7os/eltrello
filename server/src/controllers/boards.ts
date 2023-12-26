import { NextFunction, Response } from "express";
import BoardModel from '../models/board'
import { ExpressRequestInterface } from "../types/expressRequest.interface";

export const getBoards = async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.sendStatus(401)
    const boards = await BoardModel.find({userId: req.user.id})
    res.send(boards)
  } catch (err) {
    next(err)
  }
}

export const createBoard = async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.sendStatus(401)
    const newBoard = new BoardModel({
      title: req.body.title,
      userId: req.user.id
    })
    const savedBoard = await newBoard.save()
    
    res.send(savedBoard)
  } catch (err) {
    next(err)
  }
}

export const getBoard = async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.sendStatus(401)
    const boardId = req.params.boardId
    const board = await BoardModel.findById({_id: boardId})
    res.send(board)
  } catch (err) {
    next(err)
  }
}