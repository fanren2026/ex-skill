import { create } from 'zustand';
import type { Post } from '../types';
import { communityService } from '../services/mockServices';
import { useUserStore } from './userStore';

interface CommunityStore {
  posts: Post[];
  isLoading: boolean;
  filterLanguage: string | null;
  fetchPosts: (language?: string) => Promise<void>;
  createPost: (content: string, language: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  setFilterLanguage: (language: string | null) => void;
}

export const useCommunityStore = create<CommunityStore>((set, get) => ({
  posts: [],
  isLoading: false,
  filterLanguage: null,

  fetchPosts: async (language?: string) => {
    set({ isLoading: true });
    try {
      const posts = await communityService.getPosts(language || get().filterLanguage || undefined);
      set({ posts, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  createPost: async (content: string, language: string) => {
    const user = useUserStore.getState().user;
    if (!user) return;
    
    try {
      const newPost = await communityService.createPost(content, language, user);
      set(state => ({ posts: [newPost, ...state.posts] }));
    } catch {
      // Handle error silently
    }
  },

  likePost: async (postId: string) => {
    try {
      await communityService.likePost(postId);
      set(state => ({
        posts: state.posts.map(p => 
          p.id === postId 
            ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
            : p
        ),
      }));
    } catch {
      // Handle error silently
    }
  },

  setFilterLanguage: (language: string | null) => {
    set({ filterLanguage: language });
    get().fetchPosts();
  },
}));
