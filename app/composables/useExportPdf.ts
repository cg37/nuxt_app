export function useExportPdf() {
    async function exportToPdf(fileName: string, element: HTMLElement) {
        const html2canvas = (await import("html2canvas")).default;
        const { default: jsPDF } = await import("jspdf");

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false
        });

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 190; // A4 width in mm with margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pdf = new jsPDF({
            orientation: imgWidth > imgHeight ? "l" : "p",
            unit: "mm",
            format: "a4"
        });

        const pageHeight = pdf.internal.pageSize.getHeight();
        let heightLeft = imgHeight;
        let position = 10;

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 20;

        while (heightLeft > 0) {
            position = -(imgHeight - heightLeft) + 10;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight - 20;
        }

        pdf.save(fileName);
    }

    return { exportToPdf };
}
