'use client';

import { useState, useEffect } from 'react';
import { SummaryCards } from '@/components/analytics/summary-cards';
import { AnalyticsTable } from '@/components/analytics/data-table';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LocationMap } from '@/components/analytics/map-container';
import { Skeleton } from '@/components/ui/skeleton';
import { AnalyticsData, AnalyticsSummary } from '@/types/device.ts';

export default function DashboardPage() {
    const [summary, setSummary] = useState<AnalyticsSummary>({
        totalVisits: 0,
        devices: {},
        browsers: {},
        os: {},
    });
    const [data, setData] = useState<AnalyticsData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});

    const buildQueryParams = () => {
        const params = new URLSearchParams();

        if (dateRange.start) {
            params.append('dateFrom', dateRange.start.toISOString());
        }

        if (dateRange.end) {
            params.append('dateTo', dateRange.end.toISOString());
        }

        params.append('summary', 'true');
        return params.toString();
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const queryParams = buildQueryParams();
            const response = await fetch(`/api/analytics?${queryParams}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();

            if (!result || typeof result !== 'object') {
                throw new Error('Invalid data format from server');
            }

            // Normalize data to ensure consistent structure
            const normalizedData = Array.isArray(result.data)
                ? result.data.map((item: any) => ({
                    id: item.id || '',
                    timestamp: item.timestamp || '',
                    device: {
                        type: item.device?.type || 'unknown',
                        model: item.device?.model,
                        vendor: item.device?.vendor
                    },
                    browser: {
                        name: item.browser?.name || 'unknown',
                        version: item.browser?.version
                    },
                    os: {
                        name: item.os?.name || 'unknown',
                        version: item.os?.version
                    },
                    location: item.location || undefined,
                    geoData: item.geoData || undefined,
                    ...item
                }))
                : [];

            setSummary({
                totalVisits: result.totalVisits || 0,
                devices: result.devices || {},
                browsers: result.browsers || {},
                os: result.os || {},
            });

            setData(normalizedData);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch data');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    const handleRetry = () => {
        fetchData();
    };

    const handleDateChange = (range: { start?: Date; end?: Date }) => {
        // Validação básica das datas
        if (range.start && range.end && range.start > range.end) {
            setError('Invalid date range: start date must be before end date');
            return;
        }
        setDateRange(range);
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
                <div className="flex space-x-2">
                    <DateRangePicker
                        onSelect={handleDateChange}
                        initialRange={dateRange}
                    />
                    <Button
                        onClick={() => setDateRange({})}
                        variant="outline"
                        disabled={loading}
                    >
                        Reset
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <span>{error}</span>
                    <button
                        onClick={handleRetry}
                        className="absolute right-2 top-2 text-red-700 hover:text-red-900"
                    >
                        Retry
                    </button>
                </div>
            )}

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                    <TabsTrigger value="locations">Localizações</TabsTrigger>
                    <TabsTrigger value="raw-data">Dados Completos</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <SummaryCards
                        data={summary}
                        loading={loading}
                    />

                    <Card>
                        <CardHeader>
                            <CardTitle>Visitas Recentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-[300px] w-full" />
                            ) : data.length > 0 ? (
                                <AnalyticsTable
                                    data={data.slice(0, 10)}
                                    loading={false}
                                />
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No data available
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="locations">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mapa de Localizações</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[500px]">
                            {loading ? (
                                <Skeleton className="h-full w-full" />
                            ) : data.filter(d => d.location || d.geoData).length > 0 ? (
                                <LocationMap
                                    locations={data.map(item => ({
                                        ...(item.location || {}),
                                        ...(item.geoData || {})
                                    }))}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    No location data available
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="raw-data">
                    <Card>
                        <CardHeader>
                            <CardTitle>Todos os Dados Coletados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-[500px] w-full" />
                            ) : data.length > 0 ? (
                                <AnalyticsTable
                                    data={data}
                                    loading={false}
                                    fullData
                                />
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No data available
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}