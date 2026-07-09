/**
 * Generates a thumbnail data URL from a video file or URL.
 * @param fileOrUrl The video File object or URL string.
 * @param seekTime The time in seconds to capture the frame from (default: 1.0).
 * @returns A Promise that resolves to the data URL of the thumbnail image.
 */
export const generateVideoThumbnail = async (
    fileOrUrl: File | string,
    seekTime: number = 1.0
): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Create a video element
        const video = document.createElement("video");

        // Set crossOrigin to anonymous to avoid tainted canvas issues with remote URLs
        video.crossOrigin = "anonymous";

        // Mute the video to ensure it can play/seek without user interaction limitations in some browsers
        video.muted = true;

        // Preload metadata to know duration and dimensions
        video.preload = "metadata";

        // Set the source
        if (fileOrUrl instanceof File) {
            video.src = URL.createObjectURL(fileOrUrl);
        } else {
            video.src = fileOrUrl;
        }

        // Event listener for when metadata is loaded
        video.onloadedmetadata = () => {
            // Ensure seekTime is within video duration
            if (seekTime > video.duration) {
                seekTime = video.duration / 2; // Fallback to middle if seekTime is too long
            }
            video.currentTime = seekTime;
        };

        // Event listener for when the frame at currentTime is available
        video.onseeked = () => {
            try {
                // Create a canvas to draw the frame
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Could not get canvas context"));
                    return;
                }

                // Draw the video frame to the canvas
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert canvas to data URL
                const dataUrl = canvas.toDataURL("image/jpeg", 0.7); // Use JPEG with 70% quality

                // Cleanup
                if (fileOrUrl instanceof File) {
                    URL.revokeObjectURL(video.src);
                }

                resolve(dataUrl);
            } catch (error) {
                reject(error);
            }
        };

        // Handle errors
        video.onerror = (e) => {
            reject(new Error("Error loading video"));
        };
    });
};
