import { useCallback, useEffect, useMemo, useState } from "react";

function getFriendlyRequestError(error: unknown) {
    const rawMessage = error instanceof Error
        ? error.message
        : typeof error === "string"
            ? error
            : "";

    if (!rawMessage) return "Não foi possível concluir a requisição. Tente novamente.";

    const httpErrorMatch = rawMessage.match(/Erro ao buscar (.+): (\d+)/i);

    if (httpErrorMatch) {
        const [, requestLabel, status] = httpErrorMatch;

        if (status === "404") {
            return requestLabel === "historico"
                ? "Jogador não encontrado. Confira o nome e a tag informados."
                : "Não encontramos os dados solicitados para essa partida.";
        }

        if (status === "429") {
            return "Muitas buscas em sequência. Aguarde um pouco e tente novamente.";
        }

        if (["500", "502", "503", "504"].includes(status)) {
            return "O servidor não conseguiu responder agora. Tente novamente em instantes.";
        }

        return `Não foi possível buscar ${requestLabel}. Tente novamente.`;
    }

    if (rawMessage.toLowerCase().includes("failed to fetch")) {
        return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
    }

    return rawMessage;
}

function useRequestState() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!error) return;

        const timeoutId = window.setTimeout(() => {
            setError("");
        }, 3000);

        return () => window.clearTimeout(timeoutId);
    }, [error]);

    const run = useCallback(async function run<T>(fn: () => Promise<T>): Promise<Awaited<T> | undefined> {
        setLoading(true);
        setError("");

        try {
            const result = await fn();

            return result;
        } catch(e) {
            const friendlyError = getFriendlyRequestError(e);

            console.error(e);
            setError(friendlyError);

            return undefined;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(function clearError() {
        setError("");
    }, []);

    return useMemo(() => ({
        loading,
        error,
        run,
        clearError,
    }), [clearError, error, loading, run]);
}

export default useRequestState;
