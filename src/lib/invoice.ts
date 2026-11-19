import { jsPDF } from "jspdf";

interface BookingForInvoice {
  _id: string;
  studioTitle?: string;
  studioLocation?: string;
  bookingDate?: string;
  totalPrice?: number;
  status?: string;
  sessionHours?: number;
  hourlyRate?: number;
  securityDeposit?: number;
}

interface Customer {
  name?: string | null;
  email?: string | null;
}

export function generateBookingInvoice(
  booking: BookingForInvoice,
  customer: Customer
): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = margin;

  const safe = (value: unknown, fallback = "N/A"): string => {
    if (value === null || value === undefined) return fallback;
    const str = String(value).trim();
    return str ? str : fallback;
  };

  const invoiceNumber = `INV-${(booking._id || "").slice(-8).toUpperCase()}`;
  const generationDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Header
  doc.setFontSize(22);
  doc.setTextColor(245, 158, 11);
  doc.text("StudioSpace", margin, y);
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text("Creative Studio Booking Invoice", margin, y + 16);
  y += 40;

  // Invoice meta
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text(`Invoice Number: ${invoiceNumber}`, margin, y);
  doc.text(`Invoice Date: ${generationDate}`, pageWidth - margin, y, {
    align: "right",
  });
  y += 16;
  doc.text(`Booking Status: ${safe(booking.status)}`, margin, y);
  y += 24;

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 16;

  // Customer section
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text("Billed To", margin, y);
  y += 14;
  doc.setFontSize(10);
  doc.text(`Name: ${safe(customer.name)}`, margin, y);
  y += 13;
  doc.text(`Email: ${safe(customer.email)}`, margin, y);
  y += 20;

  // Studio section
  doc.setFontSize(12);
  doc.text("Studio Details", margin, y);
  y += 14;
  doc.setFontSize(10);
  doc.text(`Studio: ${safe(booking.studioTitle)}`, margin, y);
  y += 13;
  doc.text(`Location: ${safe(booking.studioLocation)}`, margin, y);
  y += 20;

  // Booking section
  doc.setFontSize(12);
  doc.text("Booking Details", margin, y);
  y += 14;
  doc.setFontSize(10);
  doc.text(`Booking Date: ${safe(booking.bookingDate)}`, margin, y);
  y += 13;
  const sessionHours = booking.sessionHours ?? 4;
  doc.text(`Session Length: ${sessionHours} hours`, margin, y);
  y += 13;
  if (booking.hourlyRate !== undefined) {
    doc.text(`Hourly Rate: $${Number(booking.hourlyRate).toFixed(2)}/hr`, margin, y);
    y += 13;
  }
  if (booking.securityDeposit !== undefined) {
    doc.text(
      `Security Deposit: $${Number(booking.securityDeposit).toFixed(2)}`,
      margin,
      y
    );
    y += 13;
  }
  y += 8;

  // Divider
  doc.line(margin, y, pageWidth - margin, y);
  y += 16;

  // Total
  doc.setFontSize(13);
  doc.setTextColor(245, 158, 11);
  const total = Number(booking.totalPrice ?? 0);
  doc.text(`Total: $${total.toFixed(2)}`, pageWidth - margin, y, {
    align: "right",
  });
  y += 24;

  // Footer note
  doc.setFontSize(9);
  doc.setTextColor(140, 140, 140);
  doc.text(
    "Thank you for booking with StudioSpace. This invoice was generated automatically.",
    margin,
    y
  );
  y += 12;
  doc.text(
    "For questions about your booking, contact the studio host through your dashboard.",
    margin,
    y
  );

  doc.save(`invoice-${invoiceNumber}.pdf`);
}
