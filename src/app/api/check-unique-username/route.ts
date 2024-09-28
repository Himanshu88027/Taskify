import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { usernameValidation } from "@/schemas/user-schema";
import { z } from "zod";

const usernameQuerySchema = z.object({
    username: usernameValidation
})
export async function GET(request: Request) {
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParams = {
            username: searchParams.get('username')
        }
        const result = usernameQuerySchema.safeParse(queryParams)
    
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message:
                      usernameErrors?.length > 0
                      ? usernameErrors.join(', ')
                      : 'Invalid query parameters',
                  },
                  { status: 400 }
            )
        }
        // Perform database query or fetch data from cache
    
        const { username } = result.data;
        const existingVerifiedUse = await UserModel.findOne({
            username,
            isVerified: true
        })
    
        if (existingVerifiedUse) {
            return Response.json(
                {
                    success: false,
                    message: 'Username is not available',
                },
                { status: 200 }
            )
        }
        return Response.json(
            {
                success: true,
                message: 'Username is unique',
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error cheking username: ",error)
        return Response.json(
            {
                success: false,
                message: 'Error cheking username',
            },
            { status: 500 }
        )
    }
    
}