import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImR1bW15QGdtYWlsLmNvbSIsImV4cCI6MTc1ODM1MDUzOX0.wuQL3JCW-cGYCRaO49tejm29H-SVPAFSvUTyQwfpacU"
    
    //await request.headers.get("Authorization")?.split(" ")[1]

    if(!token){
        return NextResponse.json({message:"トークンがありません"})
    }

    try{
        const secretKey = new TextEncoder().encode("next-market-app-book")
        const decodedJwt = await jwtVerify(token,secretKey)
        console.log("decodedJwt,", decodedJwt)

        return NextResponse.next()
    }catch{
        return NextResponse.json({message:"不正なトークンです、もう一度ログインしてください"})
    }
}

export const config = {
    matcher: ["/api/item/create", "/api/item/update/:path*","/api/item/delete/:path*"],
}
