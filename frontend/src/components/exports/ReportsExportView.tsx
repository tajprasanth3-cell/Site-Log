import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, FileText, Calendar, CheckCircle2, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const ReportsExportView: React.FC = () => {
  const {
    dailyReports,
    projects,
    workers,
    materials,
    equipment,
    issues,
    safetyObservations,
    showToast,
  } = useApp();

  const [dateRange, setDateRange] = useState('2026-01-01 to 2026-10-19');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [formatFilter, setFormatFilter] = useState<'All' | 'CSV' | 'PDF'>('All');

  // Real CSV export helper
  const triggerCSVDownload = (filename: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${filename} successfully!`);
    setDownloadSuccess(filename);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  // Real PDF export helper using jsPDF & autoTable
  const triggerPDFDownload = (title: string, headers: string[], rows: (string | number)[][]) => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

    // Header Title & Branding
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); // #0f172a
    doc.text(`Site Log - ${title}`, 40, 42);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // #64748b
    doc.text(
      `Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}  |  Date Range: ${dateRange}  |  Total Records: ${rows.length}`,
      40,
      58
    );

    // Styled Data Table
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 72,
      styles: {
        font: 'helvetica',
        fontSize: 8.5,
        cellPadding: 5,
        textColor: [15, 23, 42],
        lineColor: [226, 232, 240],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [248, 250, 252], // Light subtle background #f8fafc
        textColor: [15, 23, 42],    // Dark slate text #0f172a
        fontStyle: 'bold',
        fontSize: 9,
        lineColor: [226, 232, 240],
        lineWidth: 0.75,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { left: 40, right: 40 },
    });

    const filename = `SiteLog_${title.replace(/\s+/g, '')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    showToast(`Exported ${filename} successfully!`);
    setDownloadSuccess(filename);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  // --- Daily Reports ---
  const dailyReportHeaders = ['Report ID', 'Site', 'Project', 'Date', 'Engineer', 'Weather', 'Workers Total', 'Present', 'Status'];
  const getDailyReportRows = () =>
    dailyReports.map((r) => [
      r.id,
      r.siteName,
      r.projectName,
      r.date,
      r.engineerName,
      r.weatherCondition,
      r.workersSummary?.total || 0,
      r.workersSummary?.present || 0,
      r.status,
    ]);

  const exportDailyReportsCSV = () => {
    const csvRows = dailyReports.map((r) => [
      r.id,
      `"${r.siteName}"`,
      `"${r.projectName}"`,
      r.date,
      `"${r.engineerName}"`,
      r.weatherCondition,
      r.workersSummary?.total || 0,
      r.workersSummary?.present || 0,
      r.status,
    ]);
    const csv = [dailyReportHeaders.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
    triggerCSVDownload(`SiteLog_DailyReports_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const exportDailyReportsPDF = () => {
    triggerPDFDownload('Daily Operational Reports', dailyReportHeaders, getDailyReportRows());
  };

  // --- Project Progress ---
  const projectHeaders = ['Project ID', 'Project Name', 'Client', 'Type', 'Location', 'Progress %', 'Status', 'Start Date', 'Completion Date'];
  const getProjectRows = () =>
    projects.map((p) => [
      p.id,
      p.name,
      p.client,
      p.type,
      p.location,
      `${p.progress}%`,
      p.status,
      p.startDate,
      p.expectedCompletionDate,
    ]);

  const exportProjectProgressCSV = () => {
    const csvRows = projects.map((p) => [
      p.id,
      `"${p.name}"`,
      `"${p.client}"`,
      p.type,
      `"${p.location}"`,
      `${p.progress}%`,
      p.status,
      p.startDate,
      p.expectedCompletionDate,
    ]);
    const csv = [projectHeaders.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
    triggerCSVDownload(`SiteLog_ProjectProgress_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const exportProjectProgressPDF = () => {
    triggerPDFDownload('Project Progress Summary', projectHeaders, getProjectRows());
  };

  // --- Worker Attendance ---
  const workerHeaders = ['Worker ID', 'Name', 'Trade', 'Contractor', 'Skill', 'Today Attendance', 'Status'];
  const getWorkerRows = () =>
    workers.map((w) => [
      w.id,
      w.name,
      w.trade,
      w.contractor,
      w.skill,
      w.todayAttendance,
      w.status,
    ]);

  const exportWorkerAttendanceCSV = () => {
    const csvRows = workers.map((w) => [
      w.id,
      `"${w.name}"`,
      w.trade,
      `"${w.contractor}"`,
      w.skill,
      w.todayAttendance,
      w.status,
    ]);
    const csv = [workerHeaders.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
    triggerCSVDownload(`SiteLog_WorkerAttendance_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const exportWorkerAttendancePDF = () => {
    triggerPDFDownload('Worker Attendance Log', workerHeaders, getWorkerRows());
  };

  // --- Material Usage ---
  const materialHeaders = ['Material ID', 'Name', 'Unit', 'Opening Qty', 'Received Qty', 'Used Qty', 'Remaining Balance', 'Supplier'];
  const getMaterialRows = () =>
    materials.map((m) => [
      m.id,
      m.name,
      m.unit,
      m.openingQty,
      m.receivedQty,
      m.usedQty,
      m.remainingQty,
      m.supplier,
    ]);

  const exportMaterialUsageCSV = () => {
    const csvRows = materials.map((m) => [
      m.id,
      `"${m.name}"`,
      m.unit,
      m.openingQty,
      m.receivedQty,
      m.usedQty,
      m.remainingQty,
      `"${m.supplier}"`,
    ]);
    const csv = [materialHeaders.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
    triggerCSVDownload(`SiteLog_MaterialUsage_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const exportMaterialUsagePDF = () => {
    triggerPDFDownload('Material Usage & Inventory', materialHeaders, getMaterialRows());
  };

  // --- Equipment Usage ---
  const equipmentHeaders = ['Equipment ID', 'Name', 'Type', 'Assigned Site', 'Operator', 'Condition', 'Maintenance Status'];
  const getEquipmentRows = () =>
    equipment.map((e) => [
      e.id,
      e.name,
      e.type,
      e.assignedSiteName,
      e.operator,
      e.condition,
      e.maintenanceStatus,
    ]);

  const exportEquipmentUsageCSV = () => {
    const csvRows = equipment.map((e) => [
      e.id,
      `"${e.name}"`,
      `"${e.type}"`,
      `"${e.assignedSiteName}"`,
      `"${e.operator}"`,
      e.condition,
      e.maintenanceStatus,
    ]);
    const csv = [equipmentHeaders.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
    triggerCSVDownload(`SiteLog_EquipmentUsage_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const exportEquipmentUsagePDF = () => {
    triggerPDFDownload('Equipment & Heavy Machinery Log', equipmentHeaders, getEquipmentRows());
  };

  // --- Site Issues ---
  const issueHeaders = ['Issue ID', 'Title', 'Category', 'Severity', 'Site', 'Reported By', 'Date', 'Assigned To', 'Status'];
  const getIssueRows = () =>
    issues.map((i) => [
      i.id,
      i.title,
      i.category,
      i.severity,
      i.siteName,
      i.reportedBy,
      i.date,
      i.assignedPerson,
      i.status,
    ]);

  const exportSiteIssuesCSV = () => {
    const csvRows = issues.map((i) => [
      i.id,
      `"${i.title.replace(/"/g, '""')}"`,
      i.category,
      i.severity,
      `"${i.siteName}"`,
      `"${i.reportedBy}"`,
      i.date,
      `"${i.assignedPerson}"`,
      i.status,
    ]);
    const csv = [issueHeaders.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
    triggerCSVDownload(`SiteLog_SiteIssues_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const exportSiteIssuesPDF = () => {
    triggerPDFDownload('Site Issues & Snag List', issueHeaders, getIssueRows());
  };

  // --- Safety Observations ---
  const safetyHeaders = ['Safety ID', 'Observation', 'Risk Level', 'Location', 'Site', 'Date', 'Corrective Action', 'Status'];
  const getSafetyRows = () =>
    safetyObservations.map((s) => [
      s.id,
      s.observation,
      s.riskLevel,
      s.location,
      s.siteName,
      s.date,
      s.correctiveAction,
      s.status,
    ]);

  const exportSafetyObservationsCSV = () => {
    const csvRows = safetyObservations.map((s) => [
      s.id,
      `"${s.observation.replace(/"/g, '""')}"`,
      s.riskLevel,
      `"${s.location}"`,
      `"${s.siteName}"`,
      s.date,
      `"${s.correctiveAction.replace(/"/g, '""')}"`,
      s.status,
    ]);
    const csv = [safetyHeaders.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
    triggerCSVDownload(`SiteLog_SafetyObservations_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const exportSafetyObservationsPDF = () => {
    triggerPDFDownload('Safety & Hazard Observations', safetyHeaders, getSafetyRows());
  };

  const exportModules = [
    {
      title: 'Daily Reports',
      count: `${dailyReports.length} records`,
      exportCSV: exportDailyReportsCSV,
      exportPDF: exportDailyReportsPDF,
    },
    {
      title: 'Project Progress',
      count: `${projects.length} records`,
      exportCSV: exportProjectProgressCSV,
      exportPDF: exportProjectProgressPDF,
    },
    {
      title: 'Worker Attendance',
      count: `${workers.length} records`,
      exportCSV: exportWorkerAttendanceCSV,
      exportPDF: exportWorkerAttendancePDF,
    },
    {
      title: 'Material Usage',
      count: `${materials.length} records`,
      exportCSV: exportMaterialUsageCSV,
      exportPDF: exportMaterialUsagePDF,
    },
    {
      title: 'Equipment Usage',
      count: `${equipment.length} records`,
      exportCSV: exportEquipmentUsageCSV,
      exportPDF: exportEquipmentUsagePDF,
    },
    {
      title: 'Site Issues',
      count: `${issues.length} records`,
      exportCSV: exportSiteIssuesCSV,
      exportPDF: exportSiteIssuesPDF,
    },
    {
      title: 'Safety Observations',
      count: `${safetyObservations.length} records`,
      exportCSV: exportSafetyObservationsCSV,
      exportPDF: exportSafetyObservationsPDF,
    },
  ];

  return (
    <div className="page-content exports-view">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Export Center</h1>
          <p className="page-subtitle">
            Generate and download operational reports in CSV (Excel) and PDF Document formats
          </p>
        </div>
      </div>

      {downloadSuccess && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '0.85rem 1.25rem',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} />
          <span>Downloaded {downloadSuccess} to your device!</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="filter-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', width: '100%', maxWidth: '320px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', whiteSpace: 'nowrap' }}>Date Range:</span>
            <div className="search-input-wrapper date-range-input-wrapper" style={{ flex: '1 1 180px', width: 'auto' }}>
              <Calendar size={14} color="#94a3b8" />
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              />
            </div>
          </div>

          {/* Format Filter Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginRight: '4px' }}>Filter Format:</span>
            {(['All', 'CSV', 'PDF'] as const).map((fmt) => (
              <button
                key={fmt}
                className={`btn btn-sm ${formatFilter === fmt ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                onClick={() => setFormatFilter(fmt)}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Formats available:</span>
          <span className="badge badge-neutral">CSV</span>
          <span className="badge badge-pdf-light" style={{ background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', fontWeight: 700 }}>
            PDF
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="mobile-scroll-hint">Swipe horizontally to see all columns</div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Report Type</th>
              <th>Dataset Summary</th>
              <th>Export Format</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {exportModules.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        background: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FileText size={16} />
                    </div>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{item.title}</span>
                  </div>
                </td>
                <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{item.count}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    {(formatFilter === 'All' || formatFilter === 'CSV') && (
                      <span className="badge badge-neutral" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        CSV
                      </span>
                    )}
                    {(formatFilter === 'All' || formatFilter === 'PDF') && (
                      <span
                        className="badge badge-pdf-light"
                        style={{
                          background: '#fff1f2',
                          color: '#e11d48',
                          border: '1px solid #fecdd3',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        PDF
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {(formatFilter === 'All' || formatFilter === 'CSV') && (
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={item.exportCSV}
                        title={`Download ${item.title} as CSV`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Download size={13} />
                        <span>CSV</span>
                      </button>
                    )}
                    {(formatFilter === 'All' || formatFilter === 'PDF') && (
                      <button
                        className="btn btn-sm btn-pdf-light"
                        onClick={item.exportPDF}
                        title={`Download ${item.title} as PDF`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: '#fff1f2',
                          color: '#e11d48',
                          border: '1px solid #fecdd3',
                          fontWeight: 700,
                        }}
                      >
                        <FileDown size={13} color="#e11d48" />
                        <span>PDF</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
