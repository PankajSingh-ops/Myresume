import { create } from 'zustand';
import type { CoverLetter } from '@/types/coverLetter';

interface CoverLetterState {
    currentCoverLetter: CoverLetter | null;
    isDirty: boolean;
    isSaving: boolean;

    setCurrentCoverLetter: (coverLetter: CoverLetter | null) => void;
    updateCurrentCoverLetter: (partial: Partial<CoverLetter>) => void;
    markDirty: () => void;
    markClean: () => void;
    setSaving: (saving: boolean) => void;
}

export const useCoverLetterStore = create<CoverLetterState>((set) => ({
    currentCoverLetter: null,
    isDirty: false,
    isSaving: false,

    setCurrentCoverLetter: (coverLetter) =>
        set({ currentCoverLetter: coverLetter, isDirty: false }),

    updateCurrentCoverLetter: (partial) =>
        set((state) => ({
            currentCoverLetter: state.currentCoverLetter
                ? { ...state.currentCoverLetter, ...partial }
                : null,
            isDirty: true,
        })),

    markDirty: () => set({ isDirty: true }),
    markClean: () => set({ isDirty: false }),
    setSaving: (saving) => set({ isSaving: saving }),
}));
