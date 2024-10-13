import { Component, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-food',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './select-food.component.html',
  styleUrl: './select-food.component.css'
})
export class SelectFoodComponent {
  http = inject(HttpClient);
  users: any[] = [];
  foods: any[] = [];
  selectedUser: string = '';
  selectedFoods: string[] = [];
  selectedFoodList: any[] = [];
  submitTime: Date | null = null;
  baseUrl = 'http://localhost:3000';

  constructor() {
    this.fetchUsers();
    this.fetchFoods();
    this.refreshList();
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

  toggleFoodSelection(foodId: string) {
    const index = this.selectedFoods.indexOf(foodId);
    if (index > -1) {
      this.selectedFoods.splice(index, 1);
    } else {
      this.selectedFoods.push(foodId);
    }
  }

  isFoodSelected(foodId: string): boolean {
    return this.selectedFoods.includes(foodId);
  }

  onSubmit() {
    const selectedTime = new Date();
    const submitData = this.selectedFoods.map((foodId) => ({
      user_id: this.selectedUser,
      food_id: foodId,
      selected_time: selectedTime,
    }));

    this.http
      .post(this.baseUrl + '/submit', submitData)
      .subscribe((response) => {
        console.log('Submission successful', response);
        this.submitTime = selectedTime;
        this.refreshList(); // Update the list after submission
        this.selectedUser = ''; // Reset user selection
        this.selectedFoods = []; // Reset food selection
      });
  }

  refreshList() {
    this.http
      .get<any[]>(this.baseUrl + '/selected-food-list')
      .subscribe((data) => {
        // Map user_id to user_display_name and food_id to food_display_name
        this.selectedFoodList = this.groupByTime(data);
      });
  }

  groupByTime(data: any[]) {
    const groupedData: any[] = [];
    const timeMap = new Map<string, any>();
  
    data.forEach((record) => {
      // Format the time as "YYYY-MM-DD hh:mm:ss"
      const formattedTime = new Date(record.selected_time).toLocaleString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24-hour format
      });
  
      if (!timeMap.has(formattedTime)) {
        const user = this.users.find((u) => u.user_id === record.user_id);
        const user_display_name = user ? user.user_display_name : 'Unknown User';
  
        timeMap.set(formattedTime, {
          time: formattedTime,
          user_display_name,
          food_display_names: [],
        });
      }
  
      const food = this.foods.find((f) => f.food_id === record.food_id);
      const food_display_name = food ? food.food_display_name : 'Unknown Food';
      timeMap.get(formattedTime).food_display_names.push(food_display_name);
    });
  
    for (const entry of timeMap.values()) {
      groupedData.push(entry);
    }
  
    return groupedData.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );
  }
  

  deleteRecord(record: any) {
    this.http
      .delete<any>(this.baseUrl + `/selected-food-list/delete-by-time/${record.time}`)
      .subscribe({
        next: (res) => {
          this.refreshList(); // Refresh the table after deletion
        },
        error: (err) => console.error(err),
      });
  }

  deleteWholeList() {
    this.http
      .delete<any>(this.baseUrl + '/selected-food-list/delete-all')
      .subscribe({
        next: (res) => {
          this.refreshList(); // Refresh the table after deletion
        },
        error: (err) => console.error(err),
      });
  }
}
