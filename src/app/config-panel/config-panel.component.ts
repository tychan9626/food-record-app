import { Component, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-config-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './config-panel.component.html',
  styleUrl: './config-panel.component.css'
})
export class ConfigPanelComponent {
  http = inject(HttpClient);
  baseUrl = 'http://localhost:3000';
  users: any[] = [];
  foods: any[] = [];
  newUserID = "";
  newUserDisplayName = "";
  newFoodID = "";
  newFoodDisplayName = "";

  constructor() {
    this.fetchUsers();
    this.fetchFoods();
  }

  fetchUsers() {
    this.http.get<any[]>(this.baseUrl + '/users').subscribe((data) => {
      this.users = data;
    });
  }

  fetchFoods() {
    this.http.get<any[]>(this.baseUrl + '/foods').subscribe((data) => {
      this.foods = data;
    });
  }

  addUser() {
    const submitData = {
      user_id: this.newUserID,
      user_display_name: this.newUserDisplayName,
    };

    this.http
      .post(this.baseUrl + '/addUser', submitData)
      .subscribe((response) => {
        console.log('Submission successful', response);
        this.fetchUsers();
        this.newUserID = '';
        this.newUserDisplayName = "";
      });
  }

  deleteUser(user: any) {
    this.http
    .delete<any>(this.baseUrl + `/deleteUser/${user.user_id}`)
    .subscribe({
      next: (res) => {
        this.fetchUsers();
      },
      error: (err) => console.error(err),
    });
  }

  addFood() {
    const submitData = {
      food_id: this.newFoodID,
      food_display_name: this.newFoodDisplayName,
    };

    this.http
      .post(this.baseUrl + '/addFood', submitData)
      .subscribe((response) => {
        console.log('Submission successful', response);
        this.fetchFoods();
        this.newFoodID = '';
        this.newFoodDisplayName = "";
      });
  }

  deleteFood(food: any) {
    this.http
    .delete<any>(this.baseUrl + `/deleteFood/${food.food_id}`)
    .subscribe({
      next: (res) => {
        this.fetchFoods();
      },
      error: (err) => console.error(err),
    });
  }
}
