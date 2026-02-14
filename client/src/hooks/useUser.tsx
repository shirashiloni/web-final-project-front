import { atom, useAtom } from "jotai";
import type { User } from "../types/user";

export const userAtom = atom<User | null>(null);

export const useUser = () => {
const [user, setUser] = useAtom(userAtom);

return { user , setUser};
};

