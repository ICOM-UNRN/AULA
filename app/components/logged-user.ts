/* eslint-disable indent */
import { auth } from '@/auth';

export const loggedUser = async () => {
    const session = await auth();
    return session;
};