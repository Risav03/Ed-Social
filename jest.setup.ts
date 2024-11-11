import '@testing-library/jest-dom'
import 'whatwg-fetch'
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.Blob = require('node:buffer').Blob;
global.FormData = require('form-data');

// Mock next/server
jest.mock('next/server', () => ({
    NextResponse: {
        json: (body:any, init:any) => ({
            ...init,
            json: async () => body,
        }),
    },
}));

// Mock next/cache
jest.mock('next/cache', () => ({
    revalidatePath: jest.fn(),
}));

// Mock environment variables
process.env = {
    ...process.env,
    NEXTAUTH_SECRET: 'test-secret',
    NEXTAUTH_URL: 'http://localhost:3000',
};