import { createClient } from '@insforge/sdk';

const insforge = createClient({
    baseUrl: import.meta.env.VITE_INSFORGE_URL,
    anonKey: import.meta.env.VITE_INSFORGE_KEY
});

export default insforge;
