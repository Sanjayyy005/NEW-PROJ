import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, verification } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID parameter
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json(
        {
          error: 'Valid user ID is required',
          code: 'INVALID_USER_ID',
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        {
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    const userToDelete = existingUser[0];

    // Delete verification records where identifier matches user email
    await db
      .delete(verification)
      .where(eq(verification.identifier, userToDelete.email));

    // Delete user (sessions and accounts will cascade automatically)
    const deletedUser = await db
      .delete(user)
      .where(eq(user.id, id))
      .returning();

    return NextResponse.json(
      {
        message: 'User deleted successfully',
        user: {
          id: deletedUser[0].id,
          name: deletedUser[0].name,
          email: deletedUser[0].email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'DELETE_ERROR',
      },
      { status: 500 }
    );
  }
}