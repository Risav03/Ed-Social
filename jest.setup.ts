// // jest.setup.ts
// import '@testing-library/jest-dom';
// import { TextEncoder, TextDecoder } from 'util';

// global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;

// // Mock fetch
// global.fetch = jest.fn();

// // Mock URL
// global.URL.createObjectURL = jest.fn();

// const { Request, Response } = require('node-fetch');
// global.Request = Request;
// global.Response = Response;

// jest.mock('next/cache', () => ({
//   revalidatePath: jest.fn(),
//   revalidateTag: jest.fn(),
// }));

// // Add any custom matchers if needed
// expect.extend({
//   // Add custom matchers here if needed
// });