
export const accessTokenAtom = atom<string | null>(null);

export const useToken = () => {
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom);

  return { accessToken, setAccessToken };
};
