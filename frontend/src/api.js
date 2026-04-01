import axios from "axios";

export const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600";

const getServerBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_BASE_URL?.trim();

    if (envUrl) {
        return envUrl.replace(/\/+$/, "");
    }

    if (typeof window !== "undefined") {
        const { protocol, hostname } = window.location;
        return `${protocol}//${hostname}:5000`;
    }

    return "http://localhost:5000";
};

const SERVER_BASE_URL = getServerBaseUrl();

const normalizeImagePath = (image) => {
    if (typeof image !== "string") {
        return "";
    }

    const normalized = image.replace(/\\/g, "/").trim();
    const withoutLeadingSlash = normalized.replace(/^\/+/, "");

    if (withoutLeadingSlash.startsWith("uploads/")) {
        return withoutLeadingSlash.slice("uploads/".length);
    }

    return withoutLeadingSlash;
};

export const normalizeImageList = (images) => {
    if (Array.isArray(images)) {
        return images
            .flatMap((image) =>
                typeof image === "string" ? image.split(",") : []
            )
            .map((image) => image.trim())
            .filter(Boolean);
    }

    if (typeof images === "string") {
        return images
            .split(",")
            .map((image) => image.trim())
            .filter(Boolean);
    }

    return [];
};

export const getImageUrl = (image) => {
    if (!image) return FALLBACK_IMAGE;
    if (typeof image !== "string") return FALLBACK_IMAGE;
    const normalizedImage = image.trim();
    if (!normalizedImage) return FALLBACK_IMAGE;
    if (normalizedImage.startsWith("http://") || normalizedImage.startsWith("https://")) return normalizedImage;

    const imagePath = normalizeImagePath(normalizedImage);

    if (!imagePath) return FALLBACK_IMAGE;

    return `${SERVER_BASE_URL}/uploads/${imagePath}`;
};

const API = axios.create({
    baseURL: `${SERVER_BASE_URL}/api`,
});

// Attach token to every request if available
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default API;
