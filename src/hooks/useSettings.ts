import { useState, useEffect, useCallback } from 'react';
import insforge from '../lib/insforge';
import { Setting } from '../types';

export const useSettings = () => {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [rawSettings, setRawSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await insforge.database
                .from('site_settings')
                .select('*');
            
            if (error) throw error;
            
            if (data) {
                setRawSettings(data);
                const settingsMap: Record<string, string> = {};
                data.forEach((s: Setting) => {
                    settingsMap[s.key] = s.value;
                });
                setSettings(settingsMap);
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const getSetting = (key: string, defaultValue: string = ''): string => {
        return settings[key] || defaultValue;
    };

    const updateSetting = async (id: string, value: string) => {
        try {
            const { error } = await insforge.database
                .from('site_settings')
                .update({ value, updated_at: new Date().toISOString() })
                .eq('id', id);
            
            if (error) throw error;
            await fetchSettings();
            return { success: true };
        } catch (err) {
            console.error('Error updating setting:', err);
            return { success: false, error: err };
        }
    };

    return { settings, rawSettings, loading, error, getSetting, updateSetting, refreshSettings: fetchSettings };
};
