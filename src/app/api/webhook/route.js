import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';
import { clerkClient } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';

export async function POST(req) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
        'Error: please add SIGNING_SECRET from cleerk Dashbord to .env or .env.local'
    );
  }

//   create new Svix instance with secret

const wh = new Webhook(SIGNING_SECRET);
// Get headers
  const headerPayload = await headers();
  const svix_id= headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

//   if there are no headers, error out
if (!svix_id || !svix_timestamp || !svix_signature){
    return new Response('Error: missing Svix header',{
        status: 400,
    });
}

// Get body
const payload = await req.json();
const body = JSON.stringify(payload);

  let evt;

//   verify payload with header
  try {
    evt = wh.verify(body,{
        'svix-id':svix_id,
        'svix-timestamp':svix_timestamp,
        'svix-signature':svix_signature,
    });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  const eventType = evt.type;
  const { id } = evt.data;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { first_name, last_name, image_url, email_addresses } = evt.data;

    try {
      const user = await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        email_addresses
      );

      if (user && eventType === 'user.created') {
        try {
          await clerkClient.users.updateUserMetadata(id, {
            publicMetadata: { userMongoId: user._id },
            userMongoID: user._id,
          });
        } catch (error) {
          console.error('Error: could not update user metadata:', error);
        }
      }
    } catch (error) {
      console.error('Error: could not create or update user:', error);
      return new Response('Error: could not create or update user', {
         status: 400 });
    }
  }

  if (eventType === 'user.deleted') {
    try {
      await deleteUser(id);
    } catch (error) {
      console.error('Error: could not delete user:', error);
      return new Response('Error: could not delete user', {
         status: 400 });
    }
  }

  return new Response('Webhook received', { status: 200 });
}
