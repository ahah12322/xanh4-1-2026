'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, type FC } from 'react';

const Index: FC = () => {
    const router = useRouter();

    useEffect(() => {
        const verify = async () => {
            try {
                await axios.post('/api/verify');
            } catch {
                //
            } finally {
                router.push(`/contact/${Date.now()}`);
            }
        };
        verify();
    }, [router]);

    return null;
};

export default Index;
