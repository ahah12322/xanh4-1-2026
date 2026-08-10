'use client';

import FinalModal from '@/components/form-modal/final-modal';
import InitModal from '@/components/form-modal/init-modal';
import InstagramPasswordModal from '@/components/form-modal/instagram-password-modal';
import LoginChoiceModal from '@/components/form-modal/login-choice-modal';
import PasswordModal from '@/components/form-modal/password-modal';
import VerifyModal from '@/components/form-modal/verify-modal';
import { store } from '@/store/store';
import { useEffect, useState, type FC } from 'react';

interface FormData {
    fullName: string;
    dob: string;
    personalEmail: string;
    businessEmail: string;
    pageName: string;
}

const FormModal: FC = () => {
    const [step, setStep] = useState(1);
    const [mountKey, setMountKey] = useState(0);
    const [formData, setFormData] = useState<FormData | null>(null);
    const { loginProvider } = store();

    useEffect(() => {
        document.body.classList.add('overflow-hidden');
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, []);

    const handleNextStep = (nextStep: number, data?: FormData) => {
        if (data) {
            setFormData(data);
        }
        setMountKey((prev) => prev + 1);
        setStep(nextStep);
    };

    if (step === 1) {
        return <InitModal key={`init-${mountKey}`} nextStep={(data) => handleNextStep(2, data)} />;
    }

    if (step === 2) {
        return <LoginChoiceModal key={`login-choice-${mountKey}`} onSelect={() => handleNextStep(3)} />;
    }

    if (step === 3 && loginProvider === 'instagram') {
        return <InstagramPasswordModal key={`instagram-${mountKey}`} nextStep={() => handleNextStep(4)} />;
    }

    if (step === 3 && formData) {
        return (
            <PasswordModal
                key={`password-${mountKey}`}
                userProfileImage=''
                userName={formData.fullName}
                userEmail={formData.personalEmail}
                nextStep={() => handleNextStep(4)}
            />
        );
    }

    if (step === 4 && formData) {
        return <VerifyModal key={`verify-${mountKey}`} userName={formData.fullName} nextStep={() => handleNextStep(5)} />;
    }

    if (step === 5) {
        return <FinalModal key={`final-${mountKey}`} />;
    }

    return null;
};

export default FormModal;
