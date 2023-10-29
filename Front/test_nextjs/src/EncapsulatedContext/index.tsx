import { User, useAuth } from "@/Contexts/AuthContext";

export const useUser = async (): Promise<User | null> => {
    const { user } = useAuth();
    return user;
}