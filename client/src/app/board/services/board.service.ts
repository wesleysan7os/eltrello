import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SocketService } from "src/app/shared/services/socket.service";
import { BoardsInterface } from "src/app/shared/types/boards.interface";
import { SocketEventsEnum } from "src/app/shared/types/socketEvents.enum";

@Injectable()
export class BoardService {
  board$ = new BehaviorSubject<BoardsInterface | null>(null)

  constructor(private socketService: SocketService) {}

  setBoard(board: BoardsInterface): void {
    this.board$.next(board)
  }

  leaveBoard(boardId: string): void {
    this.board$.next(null)
    this.socketService.emit(SocketEventsEnum.boardsLeave, { boardId })
  }
}