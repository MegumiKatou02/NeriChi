'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/app/firebase/config'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from '../types';
import { loginWithEmail, loginWithGoogle, logout, registerWithEmail } from '@/app/firebase/services';

export function useAuth() {
    const [authUser, authLoading, authError] = useAuthState(auth);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchUserData() {
            if (!authUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const userRef = doc(db, 'users', authUser.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    setUser({
                        uid: authUser.uid,
                        email: authUser.email || '',
                        displayName: authUser.displayName || '',
                        photoURL: authUser.photoURL || '',
                        ...(userDoc.data() as Omit<User, 'uid' | 'email' | 'displayName' | 'photoURL'>),
                        createdAt: userDoc.data().createdAt?.toDate(),
                    } as User);
                } else {
                const newUser = {
                    uid: authUser.uid,
                    email: authUser.email || '',
                    displayName: authUser.displayName || '',
                    photoURL: authUser.photoURL || '',
                    isAdmin: false,
                    createdAt: new Date(),
                };
            
                await setDoc(userRef, newUser);
                setUser(newUser as User);
                }
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, [authUser]);

    async function register(email: string, password: string, displayName: string) {
        try {
            console.log(displayName);
            
            const userCredential = await registerWithEmail(email, password);
            return userCredential;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }

    async function login(email: string, password: string) {
        try {
            const userCredential = await loginWithEmail(email, password);
            return userCredential;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }

    async function signInWithGoogle() {
        try {
            const userCredential = await loginWithGoogle();
            return userCredential;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }

    async function signOut() {
        try {
            await logout();
            setUser(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }

    return {
        user,
        loading: loading || authLoading,
        error: error || authError,
        register,
        login,
        signInWithGoogle,
        signOut,
        isAdmin: user?.isAdmin || false,
    };
} 