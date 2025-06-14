import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';  // Import MatIconModule
import { CommonModule } from '@angular/common';  // Import CommonModule for standalone component

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],  // Add MatIconModule to the imports array
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() toggleSidebar!: () => void;  // Use `!` to indicate it will be assigned externally

  // Your header logic here (if any)
}
