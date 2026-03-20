// Утилиты для работы с фото

export function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
    }
    return new Blob([new Uint8Array(byteArrays)], { type: mimeType });
}

export function getFileSizeKB(base64String) {
    return (base64String.length * 0.75 / 1024).toFixed(0);
}

export function validatePhotoSize(base64String, isPremium) {
    const sizeKB = parseFloat(getFileSizeKB(base64String));
    const maxSize = isPremium ? 5120 : 1024;
    return {
        isValid: sizeKB <= maxSize,
        sizeKB: sizeKB,
        maxSize: maxSize
    };
}
