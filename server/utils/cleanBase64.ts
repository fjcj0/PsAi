export function cleanBase64Image(base64String: string | undefined, type: string = "png") {
    if (!base64String) return null;
    const regex = /^data:(image\/[a-zA-Z]+);base64,/;
    const cleaned = base64String.replace(regex, "");
    return `data:image/${type};base64,${cleaned}`;
}