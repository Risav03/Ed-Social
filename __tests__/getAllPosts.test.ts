import { GET } from '@/app/api/post/route'; 
import Post from '@/schemas/postSchema';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

jest.mock('@/schemas/postSchema');
jest.mock('next/cache', () => ({
    revalidatePath: jest.fn(),
}));

describe('GET Posts Route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return posts in reverse order when successful', async () => {

        const mockPosts = [
            {
                _id: '1',
                content: 'First post',
                createdBy: {
                    _id: 'user1',
                    name: 'John Doe',
                    email: 'john@example.com'
                },
                createdAt: new Date('2024-01-01')
            },
            {
                _id: '2',
                content: 'Second post',
                createdBy: {
                    _id: 'user2',
                    name: 'Jane Doe',
                    email: 'jane@example.com'
                },
                createdAt: new Date('2024-01-02')
            }
        ];

        const mockPopulate = jest.fn().mockResolvedValue(mockPosts);
        (Post.find as jest.Mock).mockReturnValue({
            populate: mockPopulate
        });

        const response = await GET({});
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.posts).toEqual(mockPosts.reverse());
        expect(Post.find).toHaveBeenCalled();
        expect(mockPopulate).toHaveBeenCalledWith('createdBy');
        expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
    });

    it('should return empty array when no posts exist', async () => {

        const mockPopulate = jest.fn().mockResolvedValue([]);
        (Post.find as jest.Mock).mockReturnValue({
            populate: mockPopulate
        });

        const response = await GET({});
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.posts).toEqual([]);
        expect(Post.find).toHaveBeenCalled();
        expect(mockPopulate).toHaveBeenCalledWith('createdBy');
        expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
    });

    it('should handle database error properly', async () => {
        const mockError = new Error('Database connection failed');
        const mockPopulate = jest.fn().mockRejectedValue(mockError);
        (Post.find as jest.Mock).mockReturnValue({
            populate: mockPopulate
        });

        const response = await GET({});
        const data = await response.json();


        expect(response.status).toBe(500);
        expect(data.error).toBeDefined();
        expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
    });

    it('should populate createdBy field correctly', async () => {

        const mockPost = {
            _id: '1',
            content: 'Test post',
            createdBy: {
                _id: 'user1',
                name: 'John Doe',
                email: 'john@example.com',
                profileImage: 'profile.jpg'
            },
            createdAt: new Date('2024-01-01')
        };

        const mockPopulate = jest.fn().mockResolvedValue([mockPost]);
        (Post.find as jest.Mock).mockReturnValue({
            populate: mockPopulate
        });

        const response = await GET({});
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.posts[0].createdBy).toEqual(mockPost.createdBy);
        expect(mockPopulate).toHaveBeenCalledWith('createdBy');
    });

    it('should call revalidatePath before database operation', async () => {
        const mockPopulate = jest.fn().mockResolvedValue([]);
        (Post.find as jest.Mock).mockReturnValue({
            populate: mockPopulate
        });

        await GET({});

        expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
        const revalidateCallOrder = (revalidatePath as jest.Mock).mock.invocationCallOrder[0];
        const findCallOrder = (Post.find as jest.Mock).mock.invocationCallOrder[0];
        expect(revalidateCallOrder).toBeLessThan(findCallOrder);
    });
});