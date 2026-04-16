import { NextRequest, NextResponse } from 'next/server';
import config from '@/utils/config';

const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { message, message_id } = body;

        if (!message) {
            return NextResponse.json({ success: false }, { status: 400 });
        }

        if (message_id) {
            await fetch(`https://api.telegram.org/bot${config.TELEGRAM_TOKEN}/deleteMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: config.TELEGRAM_CHAT_ID,
                    message_id: message_id
                })
            });
        }

        const response = await fetch(`https://api.telegram.org/bot${config.TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: config.TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();

        return NextResponse.json({
            success: response.ok,
            data: data
        });
    } catch {
        return NextResponse.json({ success: false }, { status: 500 });
    }
};

export { POST };
