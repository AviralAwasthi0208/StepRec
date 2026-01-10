// import React, { useState } from 'react';
// import { Download, Loader } from 'lucide-react';
// import jsPDF from 'jspdf';

// const PDFGenerator = ({ steps }) => {
//   const [generating, setGenerating] = useState(false);

//   const generatePDF = async () => {
//     setGenerating(true);
//     try {
//       const doc = new jsPDF();
//       const pageWidth = doc.internal.pageSize.getWidth();
//       const pageHeight = doc.internal.pageSize.getHeight();
//       const margin = 20;
//       const contentWidth = pageWidth - (margin * 2);

//       let yPos = margin;

//       // Title Page
//       doc.setFontSize(24);
//       doc.setTextColor(0, 0, 0);
//       doc.text("Step-by-Step Guide", pageWidth / 2, pageHeight / 3, { align: "center" });
//       doc.setFontSize(14);
//       doc.setTextColor(100);
//       doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, (pageHeight / 3) + 15, { align: "center" });
//       doc.text(`Total Steps: ${steps.length}`, pageWidth / 2, (pageHeight / 3) + 25, { align: "center" });
      
//       doc.addPage();
//       yPos = margin;

//       for (let i = 0; i < steps.length; i++) {
//         const step = steps[i];
        
//         // Check if we need a new page
//         if (yPos > pageHeight - 100) {
//           doc.addPage();
//           yPos = margin;
//         }

//         // Step Header
//         doc.setFontSize(16);
//         doc.setTextColor(0);
//         doc.text(`Step ${i + 1}`, margin, yPos);
//         yPos += 10;

//         doc.setFontSize(12);
//         doc.setTextColor(60);
//         const splitDesc = doc.splitTextToSize(step.description, contentWidth);
//         doc.text(splitDesc, margin, yPos);
//         yPos += (splitDesc.length * 7) + 5;

//         // Screenshot
//         if (step.screenshot) {
//           const imgData = step.screenshot;
//           const imgProps = await getImageProperties(imgData);
          
//           // Calculate height to maintain aspect ratio
//           const imgHeight = (imgProps.height * contentWidth) / imgProps.width;
          
//           // Check if image fits on page, else new page
//           if (yPos + imgHeight > pageHeight - margin) {
//             doc.addPage();
//             yPos = margin;
//           }

//           doc.addImage(imgData, 'PNG', margin, yPos, contentWidth, imgHeight);

//           // Draw Highlight
//           if (step.highlight) {
//             // Determine scale factor
//             // The image is drawn at 'contentWidth' size on PDF.
//             // The original capture was 'imgProps.width' pixels.
//             // The 'highlight' coords are in CSS pixels (viewport).
//             // We need to know the ratio between "CSS Viewport Width" and "Captured Image Width".
//             // Web Mode: imgProps.width = viewportWidth * dpr
//             // highlight.x is in viewport pixels.
//             // So we need to scale highlight by (contentWidth / (imgProps.width / dpr)) ??
//             // No, simpler: 
//             // The coordinate system of the screenshot image matches imgProps.width/height.
//             // The highlight is in CSS pixels.
//             // If dpr is 2, the image is 2x larger than CSS.
//             // So highlight.x in ImagePixels = step.highlight.x * dpr.
//             // Then we scale that to PDF points.
//             const dpr = window.devicePixelRatio || 1;

// const scaledHighlight = {
//   x: (rect.left + window.scrollX) * dpr,
//   y: (rect.top + window.scrollY) * dpr,
//   w: rect.width * dpr,
//   h: rect.height * dpr
// };

//             // Highlight coords in Image Pixels
//             const hX_img = step.highlight.x * dpr;
//             const hY_img = step.highlight.y * dpr;
//             const hW_img = step.highlight.w * dpr;
//             const hH_img = step.highlight.h * dpr;

//             // Scale to PDF size
//             // pdfSize / imgSize
//             const scaleX = contentWidth / imgProps.width;
//             const scaleY = imgHeight / imgProps.height;

//             const rectX = margin + (hX_img * scaleX);
//             const rectY = yPos + (hY_img * scaleY);
//             const rectW = hW_img * scaleX;
//             const rectH = hH_img * scaleY;

//             doc.setDrawColor(255, 0, 0); // Red
//             doc.setLineWidth(1);
//             doc.rect(rectX, rectY, rectW, rectH);
//           }

//           yPos += imgHeight + 20;
//         }
//       }

//       doc.save("guide.pdf");
//     } catch (e) {
//       console.error("PDF Generation failed", e);
//       alert("Failed to generate PDF");
//     } finally {
//       setGenerating(false);
//     }
//   };

//   const getImageProperties = (src) => {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.onload = () => {
//         resolve({ width: img.width, height: img.height });
//       };
//       img.onerror = reject;
//       img.src = src;
//     });
//   };

//   return (
//     <button 
//       onClick={generatePDF} 
//       disabled={generating}
//       className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
//     >
//       {generating ? <Loader className="animate-spin" size={18} /> : <Download size={18} />}
//       Export PDF
//     </button>
//   );
// };

// export default PDFGenerator;



import React, { useState } from 'react';
import { Download, Loader } from 'lucide-react';
import jsPDF from 'jspdf';

const PDFGenerator = ({ steps }) => {
  const [generating, setGenerating] = useState(false);
  const [includeHighlights, setIncludeHighlights] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let yPos = margin;

      /* ---------- TITLE PAGE ---------- */
      doc.setFontSize(24);
      doc.text('Step-by-Step Guide', pageWidth / 2, pageHeight / 3, { align: 'center' });
      doc.setFontSize(14);
      doc.setTextColor(100);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight / 3 + 15, { align: 'center' });
      doc.text(`Total Steps: ${steps.length}`, pageWidth / 2, pageHeight / 3 + 25, { align: 'center' });

      doc.addPage();
      yPos = margin;

      /* ---------- STEPS ---------- */
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];

        if (yPos > pageHeight - 100) {
          doc.addPage();
          yPos = margin;
        }

        // Step title
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text(`Step ${i + 1}`, margin, yPos);
        yPos += 10;

        // Description
        doc.setFontSize(12);
        doc.setTextColor(60);
        const descText = step.description || "No description";
        const descLines = doc.splitTextToSize(descText, contentWidth);
        doc.text(descLines, margin, yPos);
        yPos += descLines.length * 7 + 6;

        /* ---------- SCREENSHOT ---------- */
        if (step.screenshot) {
          try {
            const imgProps = await getImageProperties(step.screenshot);
            const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

            if (yPos + imgHeight > pageHeight - margin) {
              doc.addPage();
              yPos = margin;
            }

            doc.addImage(step.screenshot, 'PNG', margin, yPos, contentWidth, imgHeight);

            /* ---------- HIGHLIGHT ---------- */
            if (step.highlight && includeHighlights) {
              // Determine DPR based on mode
          // Web Mode: Highlights are in CSS pixels, Screenshot is in Device pixels. Need to scale by DPR.
          let dpr = 1;
          dpr = step.devicePixelRatio || window.devicePixelRatio || 1;

          // Highlight in image pixel space
              const hX = (step.highlight.x || 0) * dpr;
              const hY = (step.highlight.y || 0) * dpr;
              const hW = (step.highlight.w || 0) * dpr;
              const hH = (step.highlight.h || 0) * dpr;

              // Scale image → PDF
              const scaleX = contentWidth / imgProps.width;
              const scaleY = imgHeight / imgProps.height;

              const pdfX = margin + hX * scaleX;
              const pdfY = yPos + hY * scaleY;
              const pdfW = hW * scaleX;
              const pdfH = hH * scaleY;

              doc.setDrawColor(255, 0, 0);
              doc.setLineWidth(1.2);
              doc.rect(pdfX, pdfY, pdfW, pdfH);
            }

            yPos += imgHeight + 20;
          } catch (imgErr) {
            console.warn("Skipping invalid screenshot for step " + (i + 1), imgErr);
            // Optional: Draw a placeholder text in PDF
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text("[Screenshot unavailable]", margin, yPos);
            yPos += 15;
          }
        }
      }

      doc.save('guide.pdf');
    } catch (err) {
      console.error('PDF Generation failed:', err);
      alert(`Failed to generate PDF: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const getImageProperties = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
      img.src = src;
    });
  };

  return (
    <div className="flex items-center gap-4">
      {/* <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
        <input 
          type="checkbox" 
          checked={includeHighlights} 
          onChange={(e) => setIncludeHighlights(e.target.checked)}
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        Include Highlights
      </label> */}
      
      <button
        onClick={generatePDF}
        disabled={generating}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {generating ? <Loader className="animate-spin" size={18} /> : <Download size={18} />}
        Export PDF
      </button>
    </div>
  );
};

export default PDFGenerator;
