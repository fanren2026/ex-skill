import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { communityService } from '../services/mockServices';
import type { Post, Comment, PostFilter, User } from '../types';

interface CommunityState {
  posts: Post[];
  currentPost: Post | null;
  comments: Comment[];
  filter: PostFilter;
  isLoading: boolean;
  error: string | null;

  loadPosts: (filter?: PostFilter) => Promise<void>;
  loadPost: (postId: string) => Promise<void>;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Post>;
  likePost: (postId: string) => Promise<void>;
  loadComments: (postId: string) => Promise<void>;
  addComment: (postId: string, user: User, content: string) => Promise<void>;
  setFilter: (filter: Partial<PostFilter>) => void;
  clearError: () => void;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      posts: [],
      currentPost: null,
      comments: [],
      filter: { sortBy: 'latest' },
      isLoading: false,
      error: null,

      loadPosts: async (filter) => {
        set({ isLoading: true, error: null });
        try {
          const posts = await communityService.getPosts(filter || get().filter);
          set({ posts, isLoading: false });
        } catch (error) {
          set({ error: '加载失败', isLoading: false });
        }
      },

      loadPost: async (postId) => {
        set({ isLoading: true, error: null });
        try {
          const post = await communityService.getPost(postId);
          set({ currentPost: post, isLoading: false });
        } catch (error) {
          set({ error: '加载失败', isLoading: false });
        }
      },

      createPost: async (postData) => {
        set({ isLoading: true, error: null });
        try {
          const post = await communityService.createPost(postData);
          const posts = get().posts;
          set({ posts: [post, ...posts], isLoading: false });
          return post;
        } catch (error) {
          set({ error: '创建失败', isLoading: false });
          throw error;
        }
      },

      likePost: async (postId) => {
        try {
          const newLikes = await communityService.likePost(postId);
          const posts = get().posts.map(p =>
            p.id === postId ? { ...p, likes: newLikes } : p
          );
          const currentPost = get().currentPost;
          set({
            posts,
            currentPost: currentPost?.id === postId
              ? { ...currentPost, likes: newLikes }
              : currentPost
          });
        } catch (error) {
          set({ error: '点赞失败' });
        }
      },

      loadComments: async (postId) => {
        set({ isLoading: true });
        try {
          const comments = await communityService.getComments(postId);
          set({ comments, isLoading: false });
        } catch (error) {
          set({ error: '加载失败', isLoading: false });
        }
      },

      addComment: async (postId, user, content) => {
        try {
          const comment = await communityService.addComment(postId, user, content);
          const comments = get().comments;
          set({ comments: [...comments, comment] });

          const posts = get().posts.map(p =>
            p.id === postId ? { ...p, comments: p.comments + 1 } : p
          );
          const currentPost = get().currentPost;
          set({
            posts,
            currentPost: currentPost?.id === postId
              ? { ...currentPost, comments: currentPost.comments + 1 }
              : currentPost
          });
        } catch (error) {
          set({ error: '评论失败' });
          throw error;
        }
      },

      setFilter: (filter) => {
        const currentFilter = get().filter;
        const newFilter = { ...currentFilter, ...filter };
        set({ filter: newFilter });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'zhenxie-community-storage',
      partialize: () => ({})
    }
  )
);
