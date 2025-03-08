const BASE_URL = 'https://api-mnyt.purintech.id.vn/api';

// Định nghĩa interfaces
export interface BlogPost {
    id: number;
    title: string;
    content: string;
    category: string;
    author: {
        id: number;
        name: string;
        avatar: string;
    };
    createdAt: string;
    updatedAt: string;
    thumbnail: string;
    views: number;
    likes: number;
    comments: Comment[];
}

export interface Comment {
    id: number;
    content: string;
    userId: number;
    postId: number;
    createdAt: string;
    user: {
        id: number;
        name: string;
        avatar: string;
    };
}

// Thêm interface cho API Response
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
}

// Blog Service
export const blogService = {
    // Lấy tất cả bài viết có phân trang
    getAllPosts: async (page: number = 1, limit: number = 10, category?: string) => {
        try {
            let url = `${BASE_URL}/BlogPosts/all-paginated?page=${page}&limit=${limit}`;
            if (category && category !== 'Tất cả') {
                url += `&category=${encodeURIComponent(category)}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: ApiResponse<PaginatedResponse<BlogPost>> = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    },

    // Lấy bài viết theo ID
    getPostById: async (id: string) => {
        try {
            const response = await fetch(`${BASE_URL}/BlogPosts/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching post:', error);
            throw error;
        }
    },

    // Lấy bài viết theo category
    getPostsByCategory: async (category: string, page: number = 1, limit: number = 10) => {
        try {
            const response = await fetch(
                `${BASE_URL}/BlogPosts/category/${encodeURIComponent(category)}?page=${page}&limit=${limit}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching posts by category:', error);
            throw error;
        }
    }
};

// Comment Service
export const commentService = {
    // Lấy comments của một bài viết
    getPostComments: async (postId: string) => {
        try {
            const response = await fetch(`${BASE_URL}/Comments/post/${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },

    // Thêm comment mới
    addComment: async (commentData: { postId: string; content: string }) => {
        try {
            const response = await fetch(`${BASE_URL}/Comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    }
};