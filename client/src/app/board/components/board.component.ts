import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { BoardsService } from 'src/app/shared/services/boards.services';

@Component({
  selector: 'board',
  templateUrl: './board.component.html'
})
export class BoardComponent implements OnInit {
  boardId: string | null = null;
  constructor(private boardsService: BoardsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.fetchData()
  }

  fetchData(): void {
    this.boardId = this.route.snapshot.paramMap.get('boardId')
    if (!this.boardId) throw new Error('Cant get boardID from url')
    this.boardsService.getBoard(this.boardId!).subscribe(board => console.log(board))
  }

}