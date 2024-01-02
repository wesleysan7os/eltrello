import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { BoardsService } from 'src/app/shared/services/boards.services';
import { BoardService } from '../services/board.service';
import { Observable, filter } from 'rxjs';
import { BoardsInterface } from 'src/app/shared/types/boards.interface';
import { SocketService } from 'src/app/shared/services/socket.service';
import { SocketEventsEnum } from 'src/app/shared/types/socketEvents.enum';

@Component({
  selector: 'board',
  templateUrl: './board.component.html'
})
export class BoardComponent implements OnInit {
  boardId: string | null = null;
  board$!: Observable<BoardsInterface>

  constructor(
    private boardsService: BoardsService, 
    private route: ActivatedRoute,
    private boardService: BoardService,
    private socketService: SocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchData()
    this.setBoardStream()
    this.emitBoardsJoinEvent()
    this.initializeListeners()
  }

  
  fetchData(): void {
    this.boardId = this.route.snapshot.paramMap.get('boardId')
    if (!this.boardId) throw new Error('Cant get boardID from url')
      this.boardsService.getBoard(this.boardId).subscribe(board => {
      this.boardService.setBoard(board)
    })
  }

  setBoardStream(): void {
    this.board$ = this.boardService.board$.pipe(filter(Boolean))
  }

  emitBoardsJoinEvent(): void {
    this.socketService.emit(SocketEventsEnum.boardsJoin, {
      boardId: this.boardId
    })
  }

  initializeListeners(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && this.boardId) {
        this.boardService.leaveBoard(this.boardId)
      }
    })
  }

  test(): void {
    this.socketService.emit('columns:create', {boardId: this.boardId, title: 'foo'})
  }
} 