import { POST } from '@/app/api/post/email/[email]/route'
import { connectToDB } from "@/controllers/databaseController"
import { AuthService } from "@/services/authService"
import Post from "@/schemas/postSchema"
import { getToken } from "next-auth/jwt"
import { AwsUploadService } from "@/services/awsUploadService"
import { NextResponse } from 'next/server'

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data, options) => ({
      status: options?.status || 200,
      json: async () => data,
    })),
  },
}))

// Mock dependencies
jest.mock('@/controllers/databaseController', () => ({
  connectToDB: jest.fn(),
}))

jest.mock('@/schemas/postSchema', () => ({
  create: jest.fn(),
}))

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(),
}))

jest.mock('@/services/authService', () => ({
  AuthService: {
    getAuthenticatedUser: jest.fn(),
  },
}))

jest.mock('@/services/awsUploadService', () => ({
  AwsUploadService: jest.fn(),
}))

describe('POST /api/post/email/[email]', () => {
  const mockSession = {
    email: 'test@example.com',
  }

  const mockFormData = new FormData()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getToken as jest.Mock).mockResolvedValue(mockSession)
    ;(AuthService.getAuthenticatedUser as jest.Mock).mockResolvedValue(true)
  })

  it('should create a post without media', async () => {
    // Mock data
    const mockContent = 'Test post content'
    const mockId = '123456'
    const mockPost = {
      _id: 'post123',
      content: mockContent,
      createdBy: mockId,
      media: '',
    }

    // Mock FormData
    const formData = new FormData()
    formData.append('content', mockContent)
    formData.append('id', mockId)

    // Mock request
    const mockRequest = {
      formData: jest.fn().mockResolvedValue(formData),
    }

    // Setup mock implementations
    ;(Post.create as jest.Mock).mockResolvedValue(mockPost)

    // Execute request
    const response = await POST(mockRequest)
    const data = await response.json()

    // Assertions
    expect(AuthService.getAuthenticatedUser).toHaveBeenCalledWith(mockRequest)
    expect(connectToDB).toHaveBeenCalled()
    expect(getToken).toHaveBeenCalledWith({
      req: mockRequest,
      secret: process.env.NEXTAUTH_SECRET,
    })
    expect(Post.create).toHaveBeenCalledWith({
      createdBy: mockId,
      content: mockContent,
      media: '',
    })
    expect(response.status).toBe(200)
    expect(data.post).toEqual(mockPost)
  })

  it('should create a post with media', async () => {
    // Mock data
    const mockContent = 'Test post content'
    const mockId = '123456'
    const mockMedia = new Blob(['test'], { type: 'image/jpeg' })
    const mockDate = 1234567890
    const mockAwsUrl = `https://bucket.s3.region.amazonaws.com/users/test-example.com/posts/${mockDate}`

    // Mock Date.now()
    jest.spyOn(Date, 'now').mockImplementation(() => mockDate)

    // Mock FormData
    const formData = new FormData()
    formData.append('content', mockContent)
    formData.append('id', mockId)
    formData.append('media', mockMedia)

    // Mock request
    const mockRequest = {
      formData: jest.fn().mockResolvedValue(formData),
    }

    // Setup mock implementations
    ;(AwsUploadService as jest.Mock).mockResolvedValue(true)
    ;(Post.create as jest.Mock).mockResolvedValue({
      _id: 'post123',
      content: mockContent,
      createdBy: mockId,
      media: mockAwsUrl,
    })

    // Execute request
    const response = await POST(mockRequest)
    const data = await response.json()

    // Assertions
    expect(AwsUploadService).toHaveBeenCalled()
    expect(Post.create).toHaveBeenCalledWith({
      createdBy: mockId,
      content: mockContent,
      media: mockAwsUrl,
    })
    expect(response.status).toBe(200)
    expect(data.post.media).toBe(mockAwsUrl)
  })

  it('should reject posts with content exceeding length limit', async () => {
    // Create content exceeding 200 characters
    const longContent = 'a'.repeat(201)
    
    // Mock FormData
    const formData = new FormData()
    formData.append('content', longContent)
    formData.append('id', '123')

    // Mock request
    const mockRequest = {
      formData: jest.fn().mockResolvedValue(formData),
    }

    // Execute request
    const response = await POST(mockRequest)
    const data = await response.json()

    // Assertions
    expect(response.status).toBe(406)
    expect(data.error).toBe('Content exceeding length limit')
    expect(Post.create).not.toHaveBeenCalled()
  })

  it('should handle AWS upload failure', async () => {
    // Mock data
    const mockContent = 'Test post content'
    const mockId = '123456'
    const mockMedia = new Blob(['test'], { type: 'image/jpeg' })

    // Mock FormData
    const formData = new FormData()
    formData.append('content', mockContent)
    formData.append('id', mockId)
    formData.append('media', mockMedia)

    // Mock request
    const mockRequest = {
      formData: jest.fn().mockResolvedValue(formData),
    }

    // Mock AWS upload failure
    ;(AwsUploadService as jest.Mock).mockResolvedValue(false)

    // Execute request
    const response = await POST(mockRequest)
    const data = await response.json()

    // Assertions
    expect(response.status).toBe(406)
    expect(data.message).toBe('Upload to aws failed')
    expect(Post.create).not.toHaveBeenCalled()
  })

  it('should handle database errors', async () => {
    // Mock data
    const mockContent = 'Test post content'
    const mockId = '123456'

    // Mock FormData
    const formData = new FormData()
    formData.append('content', mockContent)
    formData.append('id', mockId)

    // Mock request
    const mockRequest = {
      formData: jest.fn().mockResolvedValue(formData),
    }

    // Mock database error
    const mockError = new Error('Database error')
    ;(Post.create as jest.Mock).mockRejectedValue(mockError)

    // Execute request
    const response = await POST(mockRequest)
    const data = await response.json()

    // Assertions
    expect(response.status).toBe(500)
    expect(data.error).toBeDefined()
  })

  it('should handle authentication failure', async () => {
    // Mock authentication failure
    ;(AuthService.getAuthenticatedUser as jest.Mock).mockRejectedValue(new Error('Unauthorized'))

    // Mock request
    const mockRequest = {
      formData: jest.fn(),
    }

    // Execute request and expect it to throw
    await expect(POST(mockRequest)).rejects.toThrow('Unauthorized')

    // Verify that no database operations were attempted
    expect(Post.create).not.toHaveBeenCalled()
  })
})