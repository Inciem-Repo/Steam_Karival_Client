import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ReactDOM from "react-dom/client";
import { Certificate } from "../components/common/Certificate";

export const downloadCertificateAsPDF = async (name: string) => {
  const tempDiv = document.createElement("div");
  tempDiv.style.position = "fixed";
  tempDiv.style.top = "-9999px";
  tempDiv.style.left = "-9999px";
  tempDiv.style.width = "1200px";
  document.body.appendChild(tempDiv);

  const root = ReactDOM.createRoot(tempDiv);
  root.render(<Certificate name={name} />);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  const canvas = await html2canvas(tempDiv, {
    scale: 3,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const pdf = new jsPDF("landscape", "pt", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // keep aspect ratio, fit both width and height
  let imgWidth = pdfWidth;
  let imgHeight = (canvasHeight * pdfWidth) / canvasWidth;

  if (imgHeight > pdfHeight) {
    imgHeight = pdfHeight;
    imgWidth = (canvasWidth * pdfHeight) / canvasHeight;
  }
  const x = (pdfWidth - imgWidth) / 2;
  const y = (pdfHeight - imgHeight) / 2;

  pdf.addImage(canvas.toDataURL("image/png"), "PNG", x, y, imgWidth, imgHeight);
  pdf.save(`${name.replace(/\s+/g, "_")}_Certificate.pdf`);

  root.unmount();
  document.body.removeChild(tempDiv);
};
