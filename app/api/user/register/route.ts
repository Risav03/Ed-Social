import { connectToDB } from "@/lib/db/db";
import User from "@/schemas/userSchema";
import { NextRequest, NextResponse } from "next/server";
import {isValidEmail} from "@/services/loginValidators"
import {isValidPassword} from "@/services/loginValidators"
import {hashPassword} from  "@/services/loginValidators"

interface RegisterRequestBody {
  email: string;
  pwd: string;
  username: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RegisterRequestBody = await req.json();
    const { email, pwd, username } = body;

    // Input validation
    if (!email || !pwd || !username) {
      return new NextResponse(
        JSON.stringify({ 
          status: 'error', 
          message: 'Missing required fields' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!isValidEmail(email)) {
      return new NextResponse(
        JSON.stringify({ 
          status: 'error', 
          message: 'Invalid email format' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!isValidPassword(pwd)) {
      return new NextResponse(
        JSON.stringify({ 
          status: 'error', 
          message: 'Password must be at least 8 characters long' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    await connectToDB();

    const existingUser = await User.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ 
          status: 'error', 
          message: 'Email already registered' 
        }),
        { 
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }


    const { hash, salt } = await hashPassword(pwd);

    const userhandle = Math.round(Math.random()*100000000);

    // Create new user
    const newUser = await User.create({
      email: email.toLowerCase(),
      pwd: hash,
      salt,
      username,
      userhandle,
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const userObject = newUser.toObject();
    delete userObject.pwd;
    delete userObject.salt;

    return new NextResponse(
      JSON.stringify({
        status: 'success',
        message: 'User registered successfully',
        user: {
          id: userObject._id.toString(),
          email: userObject.email,
          username: userObject.username,
          role: userObject.role
        }
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Registration error:', error);
    
    return new NextResponse(
      JSON.stringify({ 
        status: 'error', 
        message: 'Registration failed' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}