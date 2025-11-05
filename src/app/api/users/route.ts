import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate pagination parameters
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    
    let limit = 50; // Default limit
    let offset = 0; // Default offset
    
    // Validate and parse limit
    if (limitParam) {
      const parsedLimit = parseInt(limitParam);
      if (isNaN(parsedLimit) || parsedLimit < 1) {
        return NextResponse.json({ 
          error: "Limit must be a positive integer",
          code: "INVALID_LIMIT" 
        }, { status: 400 });
      }
      // Cap limit at 100 to prevent performance issues
      limit = Math.min(parsedLimit, 100);
    }
    
    // Validate and parse offset
    if (offsetParam) {
      const parsedOffset = parseInt(offsetParam);
      if (isNaN(parsedOffset) || parsedOffset < 0) {
        return NextResponse.json({ 
          error: "Offset must be a non-negative integer",
          code: "INVALID_OFFSET" 
        }, { status: 400 });
      }
      offset = parsedOffset;
    }
    
    // Query users with pagination
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt))
      .limit(limit)
      .offset(offset);
    
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('GET users error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: "FETCH_ERROR" 
    }, { status: 500 });
  }
}