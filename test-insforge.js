import { createClient } from '@insforge/sdk';

const insforge = createClient({
    baseUrl: 'https://kt98659m.ap-southeast.insforge.app',
    anonKey: 'ik_c89fe6f0f225c438d5763ff89a894339',
});

async function testFetch() {
    console.log('Testing Products Fetch...');
    try {
        const { data, error } = await insforge.database
            .from('products')
            .select('*, categories(name)');

        if (error) {
            console.error('Fetch Error:', error);
            return;
        }

        console.log('Successfully fetched products:', data?.length);
        if (data && data.length > 0) {
            console.log('First product sample:', JSON.stringify(data[0], null, 2));
        } else {
            console.log('No products returned.');
        }

        console.log('\nTesting Categories Fetch...');
        const { data: catData, error: catError } = await insforge.database
            .from('categories')
            .select('*');

        if (catError) {
            console.error('Categories Fetch Error:', catError);
            return;
        }

        console.log('Successfully fetched categories:', catData?.length);
        if (catData && catData.length > 0) {
            console.log('First category sample:', JSON.stringify(catData[0], null, 2));
        }

    } catch (err) {
        console.error('Unexpected Error:', err);
    }
}

testFetch();
