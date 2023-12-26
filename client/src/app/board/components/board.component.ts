import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { BoardsService } from 'src/app/shared/services/boards.services';
import { BoardService } from '../services/board.service';
import { Observable, filter } from 'rxjs';
import { BoardsInterface } from 'src/app/shared/types/boards.interface';

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
    private boardService: BoardService
  ) {}

  ngOnInit(): void {
    this.fetchData()
    this.setBoardStream()
  }

  fetchData(): void {
    this.boardId = this.route.snapshot.paramMap.get('boardId')
    if (!this.boardId) throw new Error('Cant get boardID from url')
    this.boardsService.getBoard(this.boardId!).subscribe(board => {
      this.boardService.setBoard(board)
    })
  }

  setBoardStream(): void {
    this.board$ = this.boardService.board$.pipe(filter(Boolean))
  }
} 