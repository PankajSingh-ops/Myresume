'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, User, Mail, Shield, Calendar, Clock, Save, KeyRound } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useMe } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type { Metadata } from 'next';

const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
        .string()
        .min(8, 'Must be at least 8 characters')
        .regex(/[a-z]/, 'Must contain a lowercase letter')
        .regex(/[A-Z]/, 'Must contain an uppercase letter')
        .regex(/\d/, 'Must contain a number')
        .regex(/[@$!%*?&]/, 'Must contain a special character (@$!%*?&)'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
    const user = useAuthStore((s) => s.user);
    const setAuth = useAuthStore((s) => s.setAuth);
    const queryClient = useQueryClient();
    useMe(); // ensure data is loaded

    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    const initials = user
        ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
        : '';

    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        values: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
        },
    });

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        reset: resetPasswordForm,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
    });

    const onProfileSubmit = async (values: ProfileFormValues) => {
        setIsSavingProfile(true);
        try {
            const { data: res } = await api.patch('/auth/me', values);
            const updatedUser = res.data?.user || res.user || res;

            // Update the auth store
            const currentToken = useAuthStore.getState().accessToken;
            setAuth(updatedUser, currentToken || '');

            // Invalidate the query
            queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });

            toast.success('Profile updated successfully!');
        } catch {
            toast.error('Failed to update profile.');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const onPasswordSubmit = async (values: PasswordFormValues) => {
        setIsSavingPassword(true);
        try {
            await api.post('/auth/change-password', {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });
            toast.success('Password changed successfully! Please log in again.');
            resetPasswordForm();
        } catch (err: any) {
            const msg = err?.response?.data?.detail || 'Failed to change password.';
            toast.error(msg);
        } finally {
            setIsSavingPassword(false);
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Never';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                <p className="text-muted-foreground mt-1">Manage your account details and security settings.</p>
            </div>

            {/* Profile Card */}
            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-primary/80 to-primary relative">
                    <div className="absolute -bottom-12 left-6 sm:left-8">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground ring-4 ring-background shadow-lg">
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.firstName} className="h-full w-full rounded-full object-cover" />
                            ) : (
                                initials
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-6 px-6 sm:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {user.isEmailVerified ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    <Shield className="h-3 w-3" /> Verified
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                    <Shield className="h-3 w-3" /> Unverified
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="flex items-center gap-3 text-muted-foreground mb-1">
                        <Mail className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Email</span>
                    </div>
                    <p className="text-sm font-medium truncate">{user.email}</p>
                </div>
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="flex items-center gap-3 text-muted-foreground mb-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Member Since</span>
                    </div>
                    <p className="text-sm font-medium">{formatDate(user.createdAt)}</p>
                </div>
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="flex items-center gap-3 text-muted-foreground mb-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Last Login</span>
                    </div>
                    <p className="text-sm font-medium">{formatDate(user.lastLoginAt)}</p>
                </div>
            </div>

            {/* Edit Profile Form */}
            <div className="rounded-2xl border bg-card shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Personal Information</h3>
                        <p className="text-sm text-muted-foreground">Update your name and personal details.</p>
                    </div>
                </div>

                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="profile-first-name" className="text-sm font-medium">First Name</label>
                            <Input id="profile-first-name" placeholder="John" {...registerProfile('firstName')} />
                            {profileErrors.firstName && (
                                <p className="text-xs text-destructive">{profileErrors.firstName.message}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="profile-last-name" className="text-sm font-medium">Last Name</label>
                            <Input id="profile-last-name" placeholder="Doe" {...registerProfile('lastName')} />
                            {profileErrors.lastName && (
                                <p className="text-xs text-destructive">{profileErrors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input value={user.email} disabled className="bg-muted cursor-not-allowed" />
                        <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSavingProfile}>
                            {isSavingProfile ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>

            {/* Change Password Form */}
            <div className="rounded-2xl border bg-card shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-orange-500/10">
                        <KeyRound className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Change Password</h3>
                        <p className="text-sm text-muted-foreground">Update your password to keep your account secure.</p>
                    </div>
                </div>

                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
                    <div className="space-y-1.5">
                        <label htmlFor="current-password" className="text-sm font-medium">Current Password</label>
                        <Input id="current-password" type="password" placeholder="••••••••" {...registerPassword('currentPassword')} />
                        {passwordErrors.currentPassword && (
                            <p className="text-xs text-destructive">{passwordErrors.currentPassword.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
                            <Input id="new-password" type="password" placeholder="••••••••" {...registerPassword('newPassword')} />
                            {passwordErrors.newPassword && (
                                <p className="text-xs text-destructive">{passwordErrors.newPassword.message}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</label>
                            <Input id="confirm-password" type="password" placeholder="••••••••" {...registerPassword('confirmPassword')} />
                            {passwordErrors.confirmPassword && (
                                <p className="text-xs text-destructive">{passwordErrors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" variant="outline" disabled={isSavingPassword}>
                            {isSavingPassword ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <KeyRound className="mr-2 h-4 w-4" />
                            )}
                            Change Password
                        </Button>
                    </div>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-destructive/30 bg-card shadow-sm p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <Button variant="destructive" size="sm" disabled>
                    Delete Account (Coming Soon)
                </Button>
            </div>
        </div>
    );
}
