const BASE_URL = import.meta.env.VITE_BASE_URL; // usually "http://localhost:3000/api/"

export const uploadImageToSever = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
        const response = await fetch(`${BASE_URL}image/upload`, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        if (data.success) {
            // Extract the origin (http://localhost:3000) from BASE_URL
            const originUrl = new URL(BASE_URL).origin;
            const imageUrl = `${originUrl}/uploads/${data.fileId}`;
            console.log("Image URL:", imageUrl);
            return imageUrl;
        } else {
            alert("Upload failed: " + data.message);
            return "";
        }
    } catch (error) {
        console.error("Error:", error);
        return "";
    }
}

export const deleteImageToSever = async (imageUrl) => {
    // Delete is currently not supported natively in the simple local setup
    console.log("Delete image requested for", imageUrl);
    return { success: true };
}

export const initImageSever = async () => {
    const response = await fetch(`${BASE_URL}image/health`);
    return response.json();
}
