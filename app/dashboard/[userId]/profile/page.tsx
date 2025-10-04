import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProfileContent from "./ProfileContent";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) return <p>Usuário não autenticado</p>;

  return <ProfileContent userId={userId} />;
}
