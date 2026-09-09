import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

export interface IdCardExportOptions {
    filename?: string;
    title?: string;
    subtitle?: string;
    format?: "cr80" | "a4";
}

/**
 * Capture an HTML element as a high-resolution PNG data URL (3x pixel ratio for 300+ DPI crispness)
 */
export async function captureElementToPng(element: HTMLElement): Promise<string> {
    // Wait briefly to ensure all images and fonts are rendered
    await new Promise((resolve) => setTimeout(resolve, 100));

    return await toPng(element, {
        pixelRatio: 3,
        quality: 1.0,
        cacheBust: true,
        backgroundColor: "#ffffff",
        filter: (node: HTMLElement) => {
            // Exclude elements marked with data-no-export
            if (node.getAttribute && node.getAttribute("data-no-export") === "true") {
                return false;
            }
            return true;
        },
    });
}

/**
 * Export ID card as Pixel-Perfect PDF
 * - "cr80": Standard CR80 ID Card dimensions (54mm x 86mm, 2 pages: Front & Back)
 * - "a4": Standard A4 sheet with Front & Back side-by-side and cutting guides
 */
export async function exportIdCardToPdf(
    frontElement: HTMLElement,
    backElement: HTMLElement,
    options: IdCardExportOptions = {}
): Promise<void> {
    const filename = options.filename || "id-card";
    const format = options.format || "cr80";

    const [frontPng, backPng] = await Promise.all([
        captureElementToPng(frontElement),
        captureElementToPng(backElement),
    ]);

    if (format === "cr80") {
        // Standard ID Card (CR80 portrait: 54mm x 86mm)
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: [54, 86],
            compress: true,
        });

        // Page 1: Front
        pdf.addImage(frontPng, "PNG", 0, 0, 54, 86, undefined, "FAST");

        // Page 2: Back
        pdf.addPage([54, 86], "portrait");
        pdf.addImage(backPng, "PNG", 0, 0, 54, 86, undefined, "FAST");

        pdf.save(`${filename}.pdf`);
    } else {
        // Standard A4 sheet (210mm x 297mm)
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
            compress: true,
        });

        const cardW = 54;
        const cardH = 86;
        const gap = 12;
        const totalW = cardW * 2 + gap;
        const startX = (210 - totalW) / 2;
        const startY = 70;

        // Title Header
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.setTextColor(26, 35, 126);
        pdf.text(options.title || "STUDENT ID CARD", 105, 45, { align: "center" });

        if (options.subtitle) {
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            pdf.setTextColor(100, 116, 139);
            pdf.text(options.subtitle, 105, 52, { align: "center" });
        }

        // Front Card
        pdf.addImage(frontPng, "PNG", startX, startY, cardW, cardH, undefined, "FAST");
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(100, 116, 139);
        pdf.text("FRONT SIDE", startX + cardW / 2, startY + cardH + 6, { align: "center" });

        // Back Card
        const backX = startX + cardW + gap;
        pdf.addImage(backPng, "PNG", backX, startY, cardW, cardH, undefined, "FAST");
        pdf.text("BACK SIDE", backX + cardW / 2, startY + cardH + 6, { align: "center" });

        // Cutting guides info
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(148, 163, 184);
        pdf.text(
            "Print at 100% scale (no scaling) • Cut along card borders • Standard CR80 Size (54mm x 86mm)",
            105,
            startY + cardH + 20,
            { align: "center" }
        );

        pdf.save(`${filename}-a4.pdf`);
    }
}

/**
 * Export single card side as high-resolution PNG image
 */
export async function exportIdCardSideToPng(
    element: HTMLElement,
    filename: string,
    side: "front" | "back"
): Promise<void> {
    const pngDataUrl = await captureElementToPng(element);
    const link = document.createElement("a");
    link.href = pngDataUrl;
    link.download = `${filename}-${side}.png`;
    link.click();
}

/**
 * Export both Front & Back side-by-side as a single high-resolution image
 */
export async function exportBothSidesToPng(
    frontElement: HTMLElement,
    backElement: HTMLElement,
    filename: string
): Promise<void> {
    const [frontPng, backPng] = await Promise.all([
        captureElementToPng(frontElement),
        captureElementToPng(backElement),
    ]);

    const imgFront = new Image();
    const imgBack = new Image();

    await Promise.all([
        new Promise((res) => {
            imgFront.onload = res;
            imgFront.src = frontPng;
        }),
        new Promise((res) => {
            imgBack.onload = res;
            imgBack.src = backPng;
        }),
    ]);

    const padding = 60;
    const gap = 40;
    const canvas = document.createElement("canvas");
    canvas.width = imgFront.width + imgBack.width + gap + padding * 2;
    canvas.height = Math.max(imgFront.height, imgBack.height) + padding * 2;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw cards
    ctx.drawImage(imgFront, padding, padding);
    ctx.drawImage(imgBack, padding + imgFront.width + gap, padding);

    const fullPng = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = fullPng;
    link.download = `${filename}-both-sides.png`;
    link.click();
}

/**
 * Print card directly using high-res renders
 */
export async function printIdCardDirectly(
    frontElement: HTMLElement,
    backElement: HTMLElement,
    title: string
): Promise<void> {
    const [frontPng, backPng] = await Promise.all([
        captureElementToPng(frontElement),
        captureElementToPng(backElement),
    ]);

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
        throw new Error("Popup blocked. Please allow popups to print ID card.");
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                @page {
                    size: auto;
                    margin: 10mm;
                }
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    background: #ffffff;
                    padding: 20px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    gap: 24px;
                    min-height: 100vh;
                }
                .card-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }
                .card-label {
                    font-size: 10px;
                    font-weight: bold;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #64748b;
                }
                .card {
                    width: 54mm;
                    height: 86mm;
                    border-radius: 3.5mm;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .card img {
                    width: 100%;
                    height: 100%;
                    display: block;
                    object-fit: fill;
                }
                @media print {
                    body {
                        padding: 0;
                        min-height: auto;
                    }
                    .card {
                        box-shadow: none !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="card-container">
                <span class="card-label">Front Side</span>
                <div class="card"><img src="${frontPng}" alt="Front Card" /></div>
            </div>
            <div class="card-container">
                <span class="card-label">Back Side</span>
                <div class="card"><img src="${backPng}" alt="Back Card" /></div>
            </div>
            <script>
                window.onload = function() {
                    window.focus();
                    window.print();
                    setTimeout(function() { window.close(); }, 1500);
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}
