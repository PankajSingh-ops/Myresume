import { create } from 'zustand';
import type { Resume } from '@/types/resume';

interface ResumeState {
    currentResume: Resume | null;
    isDirty: boolean;
    isSaving: boolean;

    setCurrentResume: (resume: Resume | null) => void;
    updateCurrentResume: (partial: Partial<Resume>) => void;
    markDirty: () => void;
    markClean: () => void;
    setSaving: (saving: boolean) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
    currentResume: null,
    isDirty: false,
    isSaving: false,

    setCurrentResume: (resume) =>
        set({ currentResume: resume, isDirty: false }),

    updateCurrentResume: (partial) =>
        set((state) => ({
            currentResume: state.currentResume
                ? { ...state.currentResume, ...partial }
                : null,
            isDirty: true,
        })),

    markDirty: () => set({ isDirty: true }),
    markClean: () => set({ isDirty: false }),
    setSaving: (saving) => set({ isSaving: saving }),
}));
