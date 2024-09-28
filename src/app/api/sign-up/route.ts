import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

export async function POST(request: NextRequest) {
  dbConnect();
  try {
    const {username, email, password} = await request.json();
    const existingVerifiedUserByUsername = await UserModel.findOne({
        username,
        isVerified: true
    })

    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "User with this username already exists",
        },
        { status: 400 }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    console.log("sdfghjkfghjkcvbnm =====",existingUserByEmail)
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
            {
                success: false,
                message: "User with this is already exists"
            },
            {
                status: 400,
            }
        )
      } else {
        const hashedPassword = await bcrypt.hash(password, 10)
        existingUserByEmail.username = username
        existingUserByEmail.verifyCode = verifyCode
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
        existingUserByEmail.password = hashedPassword
        await existingUserByEmail.save()
      }
        
    } else {
        const hashedPassword = await bcrypt.hash(password, 10)
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)

        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptingMessage: true,
            messages: [],
        });
        await newUser.save()
    }

    const emailResponse = await sendVerificationEmail(email, username, verifyCode)

    console.log(emailResponse);

    if (!emailResponse.success) {
        return Response.json(
            {
                success: false,
                message: "Failed to send verification email",
            },
            { status: 500 }
        );
    }

    return Response.json({
        success: true,
        message: "User registered successfully. Please check your email for verification.",
    }, {status: 200});
    

  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}