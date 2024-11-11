import { GET } from '@/app/api/post/[userhandle]/route'
import Post from "@/schemas/postSchema"
import User from "@/schemas/userSchema"
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

// Mock NextResponse
jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: jest.fn().mockImplementation((data, options) => {
        return {
          status: options?.status || 200,
          json: async () => data,
        }
      }),
    },
  }
})

// Mock other dependencies
jest.mock('@/controllers/databaseController', () => ({
  connectToDB: jest.fn(),
}))

jest.mock('@/schemas/userSchema', () => ({
  findOne: jest.fn(),
}))

jest.mock('@/schemas/postSchema', () => ({
  find: jest.fn().mockReturnThis(),
  populate: jest.fn(),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

describe('GET /api/post/[userhandle]', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  it('should return posts for a valid user', async () => {
    // Mock data
    const mockUser = {
      _id: 'user123',
      userhandle: 'testuser',
    }

    const mockPosts = [
      { _id: 'post1', content: 'Test post 1', createdBy: mockUser },
      { _id: 'post2', content: 'Test post 2', createdBy: mockUser },
    ]

    // Mock request
    const mockRequest = {
      nextUrl: new URL('http://localhost:3000/api/post/testuser'),
    }

    // Setup mock implementations
    ;(User.findOne as jest.Mock).mockResolvedValue(mockUser)
    ;(Post.find as jest.Mock).mockReturnThis()
    ;(Post.populate as jest.Mock).mockResolvedValue(mockPosts)

    // Execute the request
    const response = await GET(mockRequest as any)
    const data = await response.json()

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith({ userhandle: 'testuser' })
    expect(Post.find).toHaveBeenCalledWith({ createdBy: mockUser._id })
    expect(Post.populate).toHaveBeenCalledWith('createdBy')
    expect(response.status).toBe(200)
    expect(data.posts).toEqual(mockPosts.reverse())
    expect(NextResponse.json).toHaveBeenCalledWith(
      { posts: mockPosts.reverse() },
      { status: 200 }
    )
  })

  it('should return 404 for non-existent user', async () => {
    const mockRequest = {
      nextUrl: new URL('http://localhost:3000/api/post/nonexistentuser'),
    }

    // Mock User.findOne to return null (user not found)
    ;(User.findOne as jest.Mock).mockResolvedValue(null)

    // Execute the request
    const response = await GET(mockRequest as any)
    const data = await response.json()

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith({ userhandle: 'nonexistentuser' })
    expect(response.status).toBe(404)
    expect(data.error).toBe('User not found')
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'User not found' },
      { status: 404 }
    )
  })

  it('should handle database errors', async () => {
    const mockRequest = {
      nextUrl: new URL('http://localhost:3000/api/post/testuser'),
    }

    // Mock database error
    const mockError = new Error('Database connection failed')
    ;(User.findOne as jest.Mock).mockRejectedValue(mockError)

    // Execute the request
    const response = await GET(mockRequest as any)
    const data = await response.json()

    // Assertions
    expect(response.status).toBe(500)
    expect(data.error).toBeDefined()
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: mockError },
      { status: 500 }
    )
  })
})