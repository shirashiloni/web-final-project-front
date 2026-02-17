import { atom, useAtom } from "jotai";
import type { User } from "../types/User";
import { useEffect, useState } from "react";
import { getMyUser } from "../api/users";

export const userAtom = atom<User | null>(null);

export const useUser = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      setIsLoading(true);
      const user = await getMyUser();

      if (user) {
        setUser(user);
      }

      setIsLoading(false);
    };

    loadUser();
  }, [setUser]);

  return { user, isLoading, setUser };
};
