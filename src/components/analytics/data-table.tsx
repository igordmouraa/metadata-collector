'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface AnalyticsTableProps {
    data: any[];
    loading: boolean;
    simplified?: boolean;
    fullData?: boolean;
}

export function AnalyticsTable({
                                   data = [],
                                   loading,
                                   simplified = false,
                                   fullData = false
                               }: AnalyticsTableProps) {
    const formatDate = (timestamp: string | number) => {
        try {
            return new Date(timestamp).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    const formatLocation = (location: any) => {
        if (!location) return 'Unknown';
        return `${location.latitude?.toFixed(2)}, ${location.longitude?.toFixed(2)}`;
    };

    const formatNetwork = (network: any) => {
        if (!network) return 'Unknown';
        return `${network.effectiveType || '?'}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-24">
                Loading data...
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <div className="overflow-auto max-h-[600px]">
                <Table>
                    <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Device</TableHead>
                            <TableHead>Browser</TableHead>
                            {!simplified && (
                                <>
                                    <TableHead>OS</TableHead>
                                    <TableHead>Screen</TableHead>
                                    <TableHead>Network</TableHead>
                                    <TableHead>Location</TableHead>
                                </>
                            )}
                            {fullData && (
                                <>
                                    <TableHead>IP Data</TableHead>
                                    <TableHead>Hardware</TableHead>
                                </>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={simplified ? 3 : fullData ? 9 : 7}
                                    className="h-24 text-center"
                                >
                                    No data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="whitespace-nowrap">
                                        {formatDate(item.timestamp)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.device?.type || '?'}</Badge>
                                        {fullData && (
                                            <div className="text-xs text-muted-foreground">
                                                {item.device?.vendor} {item.device?.model}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span>{item.browser?.name || '?'}</span>
                                            <Badge variant="secondary">
                                                v{item.browser?.version || '?'}
                                            </Badge>
                                        </div>
                                    </TableCell>

                                    {!simplified && (
                                        <>
                                            <TableCell>
                                                {item.os?.name || '?'}
                                                {fullData && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {item.platform}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {item.screen?.width}x{item.screen?.height}
                                                {fullData && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {item.screen?.pixelRatio}x
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {formatNetwork(item.network)}
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        {formatLocation(item.location)}
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {item.geoData?.city && (
                                                            <p>{item.geoData.city}, {item.geoData.region}</p>
                                                        )}
                                                        <p>{item.geoData?.country}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                        </>
                                    )}

                                    {fullData && (
                                        <>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        {item.ipData?.ip ? 'View IP' : 'Unknown'}
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-[300px]">
                                                        <div className="grid gap-1">
                                                            <p><strong>IP:</strong> {item.ipData?.ip || '?'}</p>
                                                            <p><strong>ASN:</strong> {item.ipData?.asn || '?'}</p>
                                                            <p><strong>Org:</strong> {item.ipData?.org || '?'}</p>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    <Badge variant="outline">
                                                        {item.hardware?.cpuCores || '?'} cores
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        {item.hardware?.memory || '?'}GB RAM
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}