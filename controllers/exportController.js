const Membership = require('../models/Membership');
const Excel = require('exceljs');
const PDFDocument = require('pdfkit');

/**
 * Admin: Export Members to Excel (.xlsx)
 * GET /api/admin/export/excel
 */
exports.exportExcel = async (req, res) => {
  try {
    const members = await Membership.find({}).sort({ createdAt: -1 });

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('AAFWS Members');

    worksheet.columns = [
      { header: 'Membership ID', key: 'membershipId', width: 20 },
      { header: 'Full Name', key: 'fullName', width: 25 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Gender', key: 'gender', width: 12 },
      { header: 'DOB', key: 'dob', width: 15 },
      { header: 'Member Type', key: 'memberType', width: 15 },
      { header: 'Bar Council No', key: 'barCouncilNo', width: 20 },
      { header: 'Enrollment Year', key: 'enrollmentYear', width: 15 },
      { header: 'Court', key: 'court', width: 20 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'City', key: 'city', width: 15 },
      { header: 'Blood Group', key: 'bloodGroup', width: 12 },
      { header: 'Emergency Contact', key: 'emergencyContact', width: 18 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Registration Date', key: 'createdAt', width: 22 }
    ];

    members.forEach(member => {
      worksheet.addRow({
        membershipId: member.membershipId || 'N/A',
        fullName: member.fullName,
        email: member.email,
        phone: member.phone,
        gender: member.gender,
        dob: member.dob,
        memberType: member.memberType || 'N/A',
        barCouncilNo: member.barCouncilNo,
        enrollmentYear: member.enrollmentYear,
        court: member.court,
        state: member.state,
        city: member.city || '',
        bloodGroup: member.bloodGroup || 'N/A',
        emergencyContact: member.emergencyContact || 'N/A',
        status: member.isActive ? 'Active' : 'Inactive',
        createdAt: member.createdAt ? new Date(member.createdAt).toLocaleString() : ''
      });
    });

    // Style the header row
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1E3A8A' } // Navy blue color
    };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=aafws-members-' + Date.now() + '.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export Excel Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to export to Excel.' });
  }
};

/**
 * Admin: Export Members to CSV
 * GET /api/admin/export/csv
 */
exports.exportCsv = async (req, res) => {
  try {
    const members = await Membership.find({}).sort({ createdAt: -1 });

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Members');

    worksheet.columns = [
      { header: 'Membership ID', key: 'membershipId' },
      { header: 'Full Name', key: 'fullName' },
      { header: 'Email', key: 'email' },
      { header: 'Phone', key: 'phone' },
      { header: 'Gender', key: 'gender' },
      { header: 'DOB', key: 'dob' },
      { header: 'Member Type', key: 'memberType' },
      { header: 'Bar Council No', key: 'barCouncilNo' },
      { header: 'Enrollment Year', key: 'enrollmentYear' },
      { header: 'Court', key: 'court' },
      { header: 'State', key: 'state' },
      { header: 'City', key: 'city' },
      { header: 'Blood Group', key: 'bloodGroup' },
      { header: 'Emergency Contact', key: 'emergencyContact' },
      { header: 'Status', key: 'status' },
      { header: 'Registration Date', key: 'createdAt' }
    ];

    members.forEach(member => {
      worksheet.addRow({
        membershipId: member.membershipId || 'N/A',
        fullName: member.fullName,
        email: member.email,
        phone: member.phone,
        gender: member.gender,
        dob: member.dob,
        memberType: member.memberType || 'N/A',
        barCouncilNo: member.barCouncilNo,
        enrollmentYear: member.enrollmentYear,
        court: member.court,
        state: member.state,
        city: member.city || '',
        bloodGroup: member.bloodGroup || 'N/A',
        emergencyContact: member.emergencyContact || 'N/A',
        status: member.isActive ? 'Active' : 'Inactive',
        createdAt: member.createdAt ? new Date(member.createdAt).toLocaleString() : ''
      });
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=aafws-members-' + Date.now() + '.csv'
    );

    await workbook.csv.write(res);
    res.end();
  } catch (error) {
    console.error('Export CSV Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to export to CSV.' });
  }
};

/**
 * Admin: Export Members to PDF Report
 * GET /api/admin/export/pdf
 */
exports.exportPdf = async (req, res) => {
  try {
    const members = await Membership.find({}).sort({ createdAt: -1 });

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=aafws-members-report-' + Date.now() + '.pdf'
    );

    doc.pipe(res);

    // Title / Header
    doc.fillColor('#1E3A8A').fontSize(20).text('All India Advocate Federation & Welfare Association', { align: 'center' });
    doc.fillColor('#B45309').fontSize(14).text('AAFWS Membership Directory Report', { align: 'center' });
    doc.moveDown(1.5);

    // Info Summary
    doc.fillColor('#374151').fontSize(10).text(`Generated On: ${new Date().toLocaleString()}`);
    doc.text(`Total Members: ${members.length}`);
    doc.moveDown(1.5);

    // Table Header
    const tableTop = doc.y;
    doc.font('Helvetica-Bold');
    doc.text('Membership ID', 30, tableTop, { width: 100 });
    doc.text('Full Name', 130, tableTop, { width: 130 });
    doc.text('Bar Council No', 260, tableTop, { width: 100 });
    doc.text('Court', 360, tableTop, { width: 80 });
    doc.text('State', 440, tableTop, { width: 80 });
    doc.text('Status', 520, tableTop, { width: 50 });

    doc.moveTo(30, tableTop + 15).lineTo(570, tableTop + 15).strokeColor('#E5E7EB').stroke();
    doc.moveDown(1);

    // Table Rows
    doc.font('Helvetica');
    let currentY = tableTop + 22;

    members.forEach((member, i) => {
      // Check if we need a new page
      if (currentY > doc.page.height - 50) {
        doc.addPage();
        currentY = 30; // Reset Y on new page
      }

      doc.fontSize(8);
      doc.text(member.membershipId || 'N/A', 30, currentY, { width: 100 });
      doc.text(member.fullName, 130, currentY, { width: 130 });
      doc.text(member.barCouncilNo, 260, currentY, { width: 100 });
      doc.text(member.court, 360, currentY, { width: 80 });
      doc.text(member.state, 440, currentY, { width: 80 });
      doc.text(member.isActive ? 'Active' : 'Inactive', 520, currentY, { width: 50 });

      doc.moveTo(30, currentY + 12).lineTo(570, currentY + 12).strokeColor('#F3F4F6').stroke();
      currentY += 16;
    });

    doc.end();
  } catch (error) {
    console.error('Export PDF Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to export to PDF.' });
  }
};
