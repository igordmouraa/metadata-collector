// Tipos básicos reutilizáveis
type OptionalNumber = number | null | undefined;
type OptionalString = string | null | undefined;
type OptionalBoolean = boolean | null | undefined;

// Interface principal para dados do dispositivo
export interface DeviceData {
    // Informações básicas
    userAgent: string;
    platform: string;
    language: string;
    timestamp: string;
    screenResolution: string;
    timezone: string;

    // Navegador
    browser: {
        name: string;
        version: string;
        major?: string;
    };

    // Sistema Operacional
    os: {
        name: string;
        version: string;
    };

    // Dispositivo
    device: {
        type: string;
        model: string;
        vendor: string;
        cpu?: string;
    };

    // Tela
    screen: {
        width: number;
        height: number;
        colorDepth: number;
        orientation?: string;
        pixelRatio: number;
    };

    // Localização física (geolocalização)
    location?: {
        latitude: number;
        longitude: number;
        accuracy: number;
        altitude?: OptionalNumber;
        altitudeAccuracy?: OptionalNumber;
        heading?: OptionalNumber;
        speed?: OptionalNumber;
    };

    // Rede
    network?: {
        effectiveType?: string;
        downlink?: number;
        rtt?: number;
        saveData?: boolean;
    };

    // Hardware
    hardware: {
        cpuCores: number;
        memory: number; // em GB
    };

    // Informações da página
    pageInfo: {
        url: string;
        referrer: string;
        origin: string;
        pathname: string;
    };

    // Dados de IP (preenchidos pelo backend)
    ipData?: IPData;

    // Dados geográficos (preenchidos pelo backend)
    geoData?: GeoData;
}

// Dados de IP detalhados
export interface IPData {
    ip?: string;
    city?: OptionalString;
    region?: OptionalString;
    region_code?: OptionalString;
    country?: OptionalString;
    country_name?: OptionalString;
    country_code?: OptionalString;
    country_code_iso3?: OptionalString;
    country_capital?: OptionalString;
    country_tld?: OptionalString;
    continent_code?: OptionalString;
    in_eu?: OptionalBoolean;
    postal?: OptionalString;
    latitude?: OptionalNumber;
    longitude?: OptionalNumber;
    utc_offset?: OptionalString;
    country_calling_code?: OptionalString;
    currency?: OptionalString;
    currency_name?: OptionalString;
    languages?: OptionalString;
    country_area?: OptionalNumber;
    country_population?: OptionalNumber;
    asn?: OptionalString;
    org?: OptionalString;
}

// Dados geográficos simplificados
export interface GeoData {
    city?: OptionalString;
    region?: OptionalString;
    country?: OptionalString;
}

// Dados de localização para o mapa
export interface LocationData {
    latitude?: OptionalNumber;
    longitude?: OptionalNumber;
    accuracy?: OptionalNumber;
    city?: OptionalString;
    region?: OptionalString;
    country?: OptionalString;
}

// Resumo analítico
export interface AnalyticsSummary {
    totalVisits: number;
    devices: Record<string, number>;
    browsers: Record<string, number>;
    os: Record<string, number>;
    locations: LocationData[];
    dailyVisits: {
        date: string;
        count: number;
    }[];
}

// Parâmetros de consulta para analytics
export interface AnalyticsQuery {
    dateFrom?: Date;
    dateTo?: Date;
    deviceType?: string;
    os?: string;
    browser?: string;
}

// Dados formatados para exibição no dashboard
export interface AnalyticsDisplayData {
    id: string;
    timestamp: string;
    device: {
        type: string;
        model?: OptionalString;
        vendor?: OptionalString;
    };
    browser: {
        name: string;
        version?: OptionalString;
    };
    os: {
        name: string;
        version?: OptionalString;
    };
    location?: LocationData;
    geoData?: GeoData;
    // Campos adicionais dinâmicos
    [key: string]: any;
}

// Tipo para dados de visita diária
export interface DailyVisitData {
    date: string;
    visits: number;
    devices: Record<string, number>;
    browsers: Record<string, number>;
}

// Tipo para resposta da API de analytics
export interface AnalyticsResponse {
    success: boolean;
    totalVisits: number;
    devices: Record<string, number>;
    browsers: Record<string, number>;
    os: Record<string, number>;
    locations: LocationData[];
    dailyVisits: DailyVisitData[];
    data: AnalyticsDisplayData[];
    error?: string;
}