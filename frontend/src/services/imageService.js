const imageBaseUrl = "https://shivamkiranastore.onrender.com";

function extractId(url) {
    if (url) {
        const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    }
    return "";
}

export const uploadImageToSever = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
        const response = await fetch(`${imageBaseUrl}/api/upload`, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        if (data.success) {
            const id = data.fileId;
            const imageUrl = `https://lh3.googleusercontent.com/d/${id}`;
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
    if (imageUrl == null) return;
    const fileId = extractId(imageUrl);
    const res = await fetch(`${imageBaseUrl}/api/delete/${fileId}`, {
        method: "DELETE"
    });
    const data = await res.json();
    return data;
}

export const initImageSever = async () => {
    const response = await fetch(`${imageBaseUrl}/api/health`);
    return response.json();
}
