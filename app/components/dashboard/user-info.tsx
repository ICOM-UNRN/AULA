import { auth } from '@/auth';

const UserInfo = async () => {
  const session = await auth();
  if (!session) return null;
  return (
    <p className=" text-2xl font-bold">Bienvenido, {session?.user?.name}!</p>
  );
};

export default UserInfo;
