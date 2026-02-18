export interface PostLink {
  url: string;
  label: string;
}

export interface Post {
  id: string;
  title: string;
  hook: string;
  body: string;
  links: PostLink[];
  tags: string[];
  published_at: string;
  status: 'draft' | 'published';
  created_at: string;
}

export interface Suggestion {
  id: string;
  topic: string;
  description: string;
  submitted_at: string;
}
