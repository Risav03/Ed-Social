import { connectToDB, disconnectFromDB, isConnectedToDB } from '@/lib/db/db';

jest.mock('mongoose', () => ({
    set: jest.fn(),
    connect: jest.fn().mockResolvedValue(true),
    disconnect: jest.fn().mockResolvedValue(true),
  }));

describe('DatabaseController', () => {
  beforeAll(() => {
    // Set the MONGO_URI environment variable for testing
    process.env.MONGO_URI = 'mongodb://localhost:27017/test_db';
  });

  afterAll(async () => {
    // Disconnect from the database after all tests
    await disconnectFromDB();
  });

  it('should connect to the database', async () => {
    // Act
    await connectToDB();

    // Assert
    expect(isConnectedToDB()).toBe(true);
  });

  it('should throw an error if the MongoDB URI is not defined', async () => {
    // Arrange
    delete process.env.MONGO_URI;

    // Act & Assert
    await expect(connectToDB()).rejects.toThrow('MongoDB URI is not defined in the environment variables');
  });

  it('should disconnect from the database', async () => {
    // Arrange
    await connectToDB();

    // Act
    await disconnectFromDB();

    // Assert
    expect(isConnectedToDB()).toBe(false);
  });

  it('should not connect if already connected', async () => {
    // Arrange
    await connectToDB();

    // Act
    const spy = jest.spyOn(console, 'log');
    await connectToDB();

    // Assert
    expect(spy).toHaveBeenCalledWith('Already connected to MongoDB');
  });

  it('should not disconnect if not connected', async () => {
    // Arrange
    await disconnectFromDB();

    // Act
    const spy = jest.spyOn(console, 'log');
    await disconnectFromDB();

    // Assert
    expect(spy).toHaveBeenCalledWith('Not connected to MongoDB');
  });
});