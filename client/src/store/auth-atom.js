import { atom, selector } from "recoil";

export const userInfoAtom = atom({
  key: "userInfoAtom",
  default: null,
});

export const userSelector = selector({
  key: "userSelector",
  get: ({ get }) => {
    const userInfo = get(userInfoAtom);
    return userInfo;
  },
});
