import User from '../models/user.model';

import { connect } from '../mongodb/mongoose';

export const createOrUpdateUser = async (
  id,
  first_name,
  last_name,
  image_url,
  email_addresses
) => {
  try {
    await connect();
    const email = email_addresses[0]?.email_address ?? email_addresses[0]?.emailAddress;
    const fields = {
      firstName: first_name || '',
      lastName: last_name || '',
      profilePicture: image_url,
      email,
    };

    // 1. Try to find and update by clerkId (normal path)
    let user = await User.findOneAndUpdate(
      { clerkId: id },
      { $set: fields },
      { new: true }
    );

    // 2. Stale record exists with same email but wrong clerkId — claim it
    if (!user && email) {
      user = await User.findOneAndUpdate(
        { email },
        { $set: { clerkId: id, ...fields } },
        { new: true }
      );
    }

    // 3. Truly new user
    if (!user) {
      user = await User.create({ clerkId: id, ...fields });
    }

    return user;
  } catch (error) {
    console.log('Error: Could not create or update user:', error);
  }
};

export const deleteUser = async (id) => {
  try {
    await connect();
    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.log('Error: Could not delete user:', error);
  }
};