import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-book-configure',
  templateUrl: './book-configure.component.html',
  styleUrls: ['./book-configure.component.css']
})
export class BookConfigureComponent implements OnInit {

  id: number;
  bookConfigureForm: FormGroup;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
  }

  onBookConfigure(){

  }

}
