import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Habilita o servidor para aceitar conexões externas
    server: {
        host: "0.0.0.0", // Aceita conexões de qualquer IP na rede
        port: 3000,      // Porta padrão do Next.js
    },

    // Configurações de CORS para desenvolvimento
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, PUT, DELETE, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Content-Type, Authorization",
                    },
                ],
            },
        ];
    },

    // Configuração para evitar problemas com hot-reload
    webpack: (config, { dev }) => {
        if (dev) {
            config.watchOptions = {
                poll: 1000,
                aggregateTimeout: 300,
            };
        }
        return config;
    },
};

export default nextConfig;