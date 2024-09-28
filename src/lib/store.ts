import { create } from 'zustand'

const useRes = create((set) => ({
  res: '',
  changeRess: (res: string) => set(() => ({ res })),
}))

export default useRes;