import { NextResponse } from 'next/server';
import { getDeviceCollection } from '@/lib/firebase/client';
import { query, where, getDocs, Timestamp } from 'firebase/firestore';

export const dynamic = 'force-dynamic'; // Garante que a rota não seja cacheada

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const collectionRef = getDeviceCollection();

        // Construir query com tratamento seguro
        let q = query(collectionRef);

        // Filtros de data com tratamento de erros
        try {
            const dateFrom = searchParams.get('dateFrom');
            const dateTo = searchParams.get('dateTo');

            if (dateFrom) {
                const fromDate = new Date(dateFrom);
                if (!isNaN(fromDate.getTime())) {
                    q = query(q, where('timestamp', '>=', Timestamp.fromDate(fromDate)));
                }
            }

            if (dateTo) {
                const toDate = new Date(dateTo);
                if (!isNaN(toDate.getTime())) {
                    q = query(q, where('timestamp', '<=', Timestamp.fromDate(toDate)));
                }
            }
        } catch (dateError) {
            console.warn('Error parsing date filters:', dateError);
        }

        // Executar query com tratamento de erros
        const snapshot = await getDocs(q);

        // Processar documentos com tratamento seguro de timestamp
        const allData = snapshot.docs.map(doc => {
            const data = doc.data();
            let timestamp = null;

            try {
                if (data.timestamp) {
                    timestamp = data.timestamp.toDate
                        ? data.timestamp.toDate().toISOString()
                        : new Date(data.timestamp).toISOString();
                }
            } catch (timestampError) {
                console.warn('Error processing timestamp for doc', doc.id, timestampError);
            }

            return {
                id: doc.id,
                ...data,
                timestamp
            };
        });

        // Processar resposta
        const responseData = {
            success: true,
            totalVisits: allData.length,
            devices: countByField(allData, 'device.type'),
            browsers: countByField(allData, 'browser.name'),
            os: countByField(allData, 'os.name'),
            data: allData
        };

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Internal Server Error',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// Funções auxiliares com tipagem melhorada
function countByField(data: any[], fieldPath: string): Record<string, number> {
    return data.reduce((acc, item) => {
        const value = getNestedValue(item, fieldPath) || 'Unknown';
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
}

function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => {
        if (acc === null || acc === undefined) return undefined;
        return acc[part];
    }, obj);
}