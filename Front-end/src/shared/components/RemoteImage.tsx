import { useCallback, useState } from "react";

type ImageStatus = "loading" | "loaded" | "error";

type Props = {
    src: string;
    alt: string;
    className?: string;
    loading?: "eager" | "lazy";
}

function RemoteImageContent({ src, alt, className = "", loading = "lazy" }: Props) {
    const [status, setStatus] = useState<ImageStatus>("loading");
    const handleImageRef = useCallback((image: HTMLImageElement | null) => {
        if (!image || !image.complete) return;

        setStatus(image.naturalWidth > 0 ? "loaded" : "error");
    }, []);

    return (
        <span
            className={[
                "remote-image-frame",
                `remote-image--${status}`,
                className,
            ].filter(Boolean).join(" ")}
        >
            <img
                ref={handleImageRef}
                className="remote-image"
                src={src}
                alt={alt}
                loading={loading}
                onLoad={() => setStatus("loaded")}
                onError={() => setStatus("error")}
            />
        </span>
    );
}

function RemoteImage(props: Props) {
    return <RemoteImageContent key={props.src} {...props} />;
}

export default RemoteImage;
