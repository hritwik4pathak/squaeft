import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { createOrUpdateUser } from '@/lib/actions/user';

export const POST = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    // Already synced — nothing to do
    if (user.publicMetadata?.userMongoId) {
      return new Response(
        JSON.stringify({ success: true, userMongoId: user.publicMetadata.userMongoId }),
        { status: 200 }
      );
    }

    // Create or find the MongoDB user
    const mongoUser = await createOrUpdateUser(
      user.id,
      user.firstName,
      user.lastName,
      user.imageUrl,
      user.emailAddresses
    );

    if (!mongoUser) {
      return new Response(JSON.stringify({ success: false, message: 'Failed to create user record' }), { status: 500 });
    }

    // Write userMongoId back to Clerk publicMetadata
    const client = await clerkClient();
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: { userMongoId: mongoUser._id.toString() },
    });

    return new Response(
      JSON.stringify({ success: true, userMongoId: mongoUser._id }),
      { status: 200 }
    );
  } catch (error) {
    console.error('ensure-synced error:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
};
