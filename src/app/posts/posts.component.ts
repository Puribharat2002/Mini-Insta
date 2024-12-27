import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  posts: {
    content: string;
    likes: number;
    comments: any[];
    imageUrl?: string;
  }[] = [];
  selectedImageUrl: string | undefined;
  userEmail: string | null = null;

  constructor(private auth: AngularFireAuth) {}

  ngOnInit() {
    // Fetch logged-in user's email
    this.auth.authState.subscribe((user) => {
      this.userEmail = user?.email || null;

      if (this.userEmail) {
        // Fetch posts for logged-in user
        this.fetchPosts();
      }
    });
  }

  fetchPosts() {
    // Example posts for demo. You can fetch posts from your backend here.
    this.posts = [
      {
        content: 'My New Post.',
        likes: 25,
        comments: [
          { name: 'user1@example.com', text: 'Nice Post user2!' },
          { name: 'user2@example.com', text: 'Thank you user1!' },
        ],
        imageUrl: '../',
      },
      {
        content: 'Hiring, Hiring!!!',
        likes: 1234,
        comments: [
          { name: 'user3@example.com', text: 'Thank you for sharing' },
        ],
        imageUrl: '',
      },
    ];
  }

  onAddPost(content: string) {
    if (!content.trim()) return;
    const post = {
      content,
      likes: 0,
      comments: [],
      imageUrl: this.selectedImageUrl,
    };
    this.posts.push(post);
    this.selectedImageUrl = undefined; // Reset image URL after adding the post
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onLike(post: any) {
    post.likes = post.likes === 0 ? 1 : 0; // Toggle like state
  }

  onAddComment(post: any, text: string) {
    if (text.trim() && this.userEmail) {
      post.comments.push({ name: this.userEmail, text });
    }
  }
}
