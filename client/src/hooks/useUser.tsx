import { atom, useAtom } from "jotai";
import type { User } from "../types/User";
import { useCallback, useEffect, useState } from "react";
import { getMyUser } from "../api/users";

export const userAtom = atom<User | null>(null);

export const useUser = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useState(true);

  const refeach = useCallback(async () => {
    try {
      setIsLoading(true);
      const user = await getMyUser();
      if (user) {
        setUser(user);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to refeach user:', error);
      setIsLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    const loadUser = async () => {
      try {

        const token = localStorage.getItem('accessToken');
        if (!token) return;

        setIsLoading(true);
        const user = await getMyUser();

        if (user) {
          setUser(user);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load user:', error);
        setIsLoading(false);
      }
    };

    loadUser();
  }, [setUser]);

  return { user, isLoading, setUser, refeach };
};
