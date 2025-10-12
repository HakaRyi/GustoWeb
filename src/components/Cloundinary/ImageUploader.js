
async function ImageUploader(file) {
    const CLOUD_NAME = "dz74ypnth";
    const UPLOAD_PRESET = "gustoImage";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
    );

    const data = await res.json();
    if (!data.secure_url) throw new Error("Upload failed");

    return data.secure_url;
}

export default ImageUploader
