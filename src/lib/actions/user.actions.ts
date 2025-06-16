'use server';

import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,

} from '../validators';
import { auth, signIn, signOut } from '../../../auth';
import { hash } from "../encrypt"
import { prisma } from '../prisma';
import { formatError } from '../utils';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { getMyCart } from './cart.actions';


export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', user);

    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (error)
    {console.log(error);
    }
    return { success: false, message: 'Invalid email or password' };
  }
}

export async function signUpUser(prevState: any, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const hashedPassword = await hash(user.password);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },

      
    });

    return {
      success: true,
      email: user.email,
      password: user.password,
    };
    redirect('/');
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
// Sign user out
export async function signOutUser() {
  // get current users cart and delete it so it does not persist to next user
  const currentCart = await getMyCart();

  if (currentCart?.id) {
    await prisma.cart.delete({ where: { id: currentCart.id } });
  } else {
    console.warn('No cart found for deletion.');
  }
  await signOut();
}

// Sign up user


