// Export utility functions for PDF, XLS, and DOC downloads

/**
 * Export selected records to PDF
 * @param {Array} selectedRecords - Array of selected record objects
 * @param {string} filename - Name of the file to download
 */
export const exportToPDF = (selectedRecords, filename = 'application-status.pdf') => {
  try {
    // Create a simple HTML table for PDF conversion
    const tableHTML = generateTableHTML(selectedRecords);
    
    // Create a new window with the table content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Application Status Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            h1 { color: #333; text-align: center; }
            .export-info { margin-bottom: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Application Status Report</h1>
          <div class="export-info">
            <p>Export Date: ${new Date().toLocaleDateString()}</p>
            <p>Total Records: ${selectedRecords.length}</p>
          </div>
          ${tableHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load, then trigger print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
    
    console.log('✅ PDF export initiated for', selectedRecords.length, 'records');
  } catch (error) {
    console.error('❌ PDF export failed:', error);
    alert('Failed to export PDF. Please try again.');
  }
};

/**
 * Export selected records to Excel (.xls)
 * @param {Array} selectedRecords - Array of selected record objects
 * @param {string} filename - Name of the file to download
 */
export const exportToXLS = (selectedRecords, filename = 'application-status.xls') => {
  try {
    // Create CSV content
    const csvContent = generateCSVContent(selectedRecords);
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename.replace('.xls', '.csv')); // Download as CSV
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    console.log('✅ XLS export completed for', selectedRecords.length, 'records');
  } catch (error) {
    console.error('❌ XLS export failed:', error);
    alert('Failed to export XLS. Please try again.');
  }
};

/**
 * Export selected records to Word (.doc)
 * @param {Array} selectedRecords - Array of selected record objects
 * @param {string} filename - Name of the file to download
 */
export const exportToDOC = (selectedRecords, filename = 'application-status.doc') => {
  try {
    // Create HTML content for Word document
    const tableHTML = generateTableHTML(selectedRecords);
    
    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>Application Status Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            h1 { color: #333; text-align: center; }
            .export-info { margin-bottom: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Application Status Report</h1>
          <div class="export-info">
            <p>Export Date: ${new Date().toLocaleDateString()}</p>
            <p>Total Records: ${selectedRecords.length}</p>
          </div>
          ${tableHTML}
        </body>
      </html>
    `;
    
    // Create and download file
    const blob = new Blob([docContent], { 
      type: 'application/msword' 
    });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    console.log('✅ DOC export completed for', selectedRecords.length, 'records');
  } catch (error) {
    console.error('❌ DOC export failed:', error);
    alert('Failed to export DOC. Please try again.');
  }
};

/**
 * Generate HTML table from selected records
 * @param {Array} selectedRecords - Array of selected record objects
 * @returns {string} HTML table string
 */
const generateTableHTML = (selectedRecords) => {
  if (!selectedRecords || selectedRecords.length === 0) {
    return '<p>No records selected for export.</p>';
  }
  
  const headers = ['Application No', 'PRO', 'Campus', 'DGM', 'Zone', 'Status'];
  
  const tableRows = selectedRecords.map(record => `
    <tr>
      <td>${record.applicationNo || '-'}</td>
      <td>${record.pro || '-'}</td>
      <td>${record.campus || '-'}</td>
      <td>${record.dgm || '-'}</td>
      <td>${record.zone || '-'}</td>
      <td>${record.status || '-'}</td>
    </tr>
  `).join('');
  
  return `
    <table>
      <thead>
        <tr>
          ${headers.map(header => `<th>${header}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
};

/**
 * Generate CSV content from selected records
 * @param {Array} selectedRecords - Array of selected record objects
 * @returns {string} CSV content string
 */
const generateCSVContent = (selectedRecords) => {
  if (!selectedRecords || selectedRecords.length === 0) {
    return 'No records selected for export.';
  }
  
  const headers = ['Application No', 'PRO', 'Campus', 'DGM', 'Zone', 'Status'];
  const csvRows = [headers.join(',')];
  
  selectedRecords.forEach(record => {
    const row = [
      record.applicationNo || '',
      record.pro || '',
      record.campus || '',
      record.dgm || '',
      record.zone || '',
      record.status || ''
    ];
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
};

/**
 * Get selected records from the data array
 * @param {Array} data - Array of all records
 * @returns {Array} Array of selected records
 */
export const getSelectedRecords = (data) => {
  return data.filter(record => record.isSelected === true);
};

/**
 * Check if any records are selected
 * @param {Array} data - Array of all records
 * @returns {boolean} True if any records are selected
 */
export const hasSelectedRecords = (data) => {
  return data.some(record => record.isSelected === true);
};
