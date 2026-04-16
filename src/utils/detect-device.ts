import { UAParser } from 'ua-parser-js';

interface DeviceInfo {
    deviceType: string;
    os: string;
    browser: string;
    model: string | null;
    cpu: string | null;
    engine: string | null;
    deviceInfo: string;
    userAgent: string;
    raw: ReturnType<UAParser['getResult']> | null;
    error?: string;
}

const formatBrowser = (browser: { name?: string; version?: string }): string => {
    if (!browser.name) {
        return 'Unknown Browser';
    }

    if (browser.version) {
        return `${browser.name} ${browser.version}`;
    }

    return browser.name;
};

const formatOS = (os: { name?: string; version?: string }): string => {
    if (!os.name) {
        return 'Unknown OS';
    }

    if (os.version) {
        return `${os.name} ${os.version}`;
    }

    return os.name;
};

const formatEngine = (engine: { name?: string; version?: string }): string | null => {
    if (!engine.name) {
        return null;
    }

    if (engine.version) {
        return `${engine.name} ${engine.version}`;
    }

    return engine.name;
};

const getDeviceModel = (device: { vendor?: string; model?: string }): string | null => {
    if (!device.vendor && !device.model) {
        return null;
    }

    const parts: string[] = [];
    if (device.vendor) parts.push(device.vendor);
    if (device.model) parts.push(device.model);

    return parts.join(' ');
};

const getDeviceType = (device: { type?: string }): string => {
    if (!device.type) {
        return 'Desktop';
    }

    return device.type.charAt(0).toUpperCase() + device.type.slice(1);
};

const detectDevice = (): DeviceInfo => {
    try {
        if (typeof window === 'undefined' || typeof navigator === 'undefined') {
            throw new TypeError('Not running in browser environment');
        }

        const userAgent = navigator.userAgent;

        if (!userAgent) {
            throw new TypeError('User-Agent string is empty');
        }

        const parser = new UAParser(userAgent);
        const result = parser.getResult();

        const browserInfo = formatBrowser(result.browser);
        const osInfo = formatOS(result.os);
        const engineInfo = formatEngine(result.engine);
        const deviceModel = getDeviceModel(result.device);
        const deviceType = getDeviceType(result.device);
        const deviceBase = deviceModel || deviceType;

        return {
            deviceType,
            os: osInfo,
            browser: browserInfo,
            model: deviceModel,
            cpu: result.cpu.architecture || null,
            engine: engineInfo,
            deviceInfo: `${deviceBase} - ${osInfo} - ${browserInfo}`,
            userAgent,
            raw: result
        };
    } catch (error) {
        const normalizedError = error instanceof Error ? error.message : 'Unknown error';

        return {
            deviceType: 'Unknown',
            os: 'Unknown OS',
            browser: 'Unknown Browser',
            model: null,
            cpu: null,
            engine: null,
            deviceInfo: 'Unknown Device - Unknown OS - Unknown Browser',
            userAgent: '',
            raw: null,
            error: normalizedError
        };
    }
};

export type { DeviceInfo };
export default detectDevice;
