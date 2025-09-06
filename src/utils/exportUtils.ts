// Utility functions for exporting data to PDF and Excel formats
import { StudentAnnualResult } from "./gradeCalculations";

export const exportToPDF = async (data: any[], title: string, headers: string[]) => {
  // Simple PDF export using browser print functionality
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .header { text-align: center; margin-bottom: 30px; }
        .date { text-align: right; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>École La Roseraie</h1>
        <h2>${title}</h2>
        <div class="date">Généré le ${new Date().toLocaleDateString('fr-FR')}</div>
      </div>
      <table>
        <thead>
          <tr>
            ${headers.map(header => `<th>${header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    setTimeout(() => printWindow.close(), 1000);
  }
};

export const exportToCSV = (data: any[], filename: string, headers: string[]) => {
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      ).join(',')
    )
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generatePaymentReceipt = (payment: any) => {
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Reçu de Paiement</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .school-name { font-size: 24px; font-weight: bold; color: #2563eb; }
        .receipt-title { font-size: 18px; margin-top: 10px; }
        .receipt-info { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .amount-box { text-align: center; font-size: 24px; font-weight: bold; color: #16a34a; border: 2px solid #16a34a; padding: 20px; margin: 20px 0; }
        .details { margin: 20px 0; }
        .row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dotted #ccc; }
        .signature-section { margin-top: 40px; text-align: right; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="school-name">École La Roseraie</div>
        <div class="receipt-title">Reçu de Paiement</div>
        <div>N° ${payment.id.substring(0, 8).toUpperCase()}</div>
      </div>

      <div class="receipt-info">
        <div class="row">
          <strong>Élève:</strong>
          <span>${payment.student_name}</span>
        </div>
        <div class="row">
          <strong>Classe:</strong>
          <span>${payment.class_name}</span>
        </div>
        <div class="row">
          <strong>Type de paiement:</strong>
          <span>${payment.type}</span>
        </div>
        <div class="row">
          <strong>Date de paiement:</strong>
          <span>${new Date(payment.date).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      <div class="amount-box">
        Montant payé: ${(payment.amount_paid || 0).toLocaleString()} FCFA
      </div>

      <div class="details">
        <div class="row">
          <strong>Montant total dû:</strong>
          <span>${payment.amount.toLocaleString()} FCFA</span>
        </div>
        <div class="row">
          <strong>Montant payé:</strong>
          <span>${(payment.amount_paid || 0).toLocaleString()} FCFA</span>
        </div>
        <div class="row">
          <strong>Reste à payer:</strong>
          <span>${(payment.amount - (payment.amount_paid || 0)).toLocaleString()} FCFA</span>
        </div>
        <div class="row">
          <strong>Statut:</strong>
          <span>${payment.status}</span>
        </div>
      </div>

      <div class="signature-section">
        <div style="border-top: 1px solid #000; margin-top: 40px; padding-top: 5px; width: 200px; margin-left: auto;">
          Cachet et Signature de l'École
        </div>
      </div>

      <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #666;">
        Merci de conserver ce reçu comme preuve de paiement
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    setTimeout(() => printWindow.close(), 1000);
  }
};

export const generateBulletin = (studentData: any, grades: any[], evaluation: string = 'Toutes évaluations') => {
  // Group grades by subject and calculate average per subject (sum of 5 evaluations / 5)
  const subjectGrades = grades.reduce((acc: { [key: string]: any[] }, grade: any) => {
    if (!acc[grade.subject_name]) {
      acc[grade.subject_name] = [];
    }
    acc[grade.subject_name].push(grade);
    return acc;
  }, {} as { [key: string]: any[] });

  // Calculate average for each subject
  const subjectNotes: Array<{subject: string, note: number, evaluationCount: number}> = Object.entries(subjectGrades).map(([subjectName, subjectGradesList]) => {
    const average = (subjectGradesList as any[]).reduce((sum: number, grade: any) => sum + grade.grade, 0) / (subjectGradesList as any[]).length;
    return {
      subject: subjectName,
      note: average,
      evaluationCount: (subjectGradesList as any[]).length
    };
  });

  // Calculate overall average (sum of subject averages / number of subjects)
  const overallAverage = subjectNotes.length > 0 ? 
    subjectNotes.reduce((sum: number, subject: any) => sum + subject.note, 0) / subjectNotes.length : 0;

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bulletin - ${studentData.first_name} ${studentData.last_name}</title>
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        body { 
          font-family: Arial, sans-serif; 
          margin: 0;
          padding: 0;
          line-height: 1.4;
          font-size: 12px;
        }
        .header { 
          text-align: center; 
          border-bottom: 2px solid #2563eb; 
          padding-bottom: 10px; 
          margin-bottom: 15px; 
        }
        .school-name { 
          font-size: 20px; 
          font-weight: bold; 
          color: #2563eb; 
          margin-bottom: 5px;
        }
        .bulletin-title { 
          font-size: 16px; 
          color: #333;
        }
        .student-info { 
          background: #f8f9fa; 
          padding: 10px; 
          border-radius: 4px; 
          margin-bottom: 15px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .info-item {
          font-size: 11px;
        }
        .info-label {
          font-weight: bold;
          color: #333;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 15px 0; 
          font-size: 11px;
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 6px 4px; 
          text-align: center; 
        }
        th { 
          background-color: #2563eb; 
          color: white; 
          font-weight: bold;
        }
        .subject-column { 
          text-align: left; 
          font-weight: 500;
        }
        .grade-excellent { color: #16a34a; font-weight: bold; }
        .grade-good { color: #2563eb; font-weight: bold; }
        .grade-average { color: #f59e0b; font-weight: bold; }
        .grade-poor { color: #dc2626; font-weight: bold; }
        .summary { 
          background: #2563eb; 
          color: white;
          padding: 10px; 
          border-radius: 4px; 
          margin: 15px 0; 
          text-align: center;
        }
        .average-score {
          font-size: 18px;
          font-weight: bold;
          margin: 5px 0;
        }
        .appreciation {
          background: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 10px;
          margin: 15px 0;
        }
        .appreciation-title {
          font-weight: bold;
          margin-bottom: 5px;
          color: #333;
        }
        .appreciation-text {
          font-style: italic;
          min-height: 40px;
          border: none;
          outline: none;
          resize: none;
          width: 100%;
          background: transparent;
        }
        .signatures { 
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 20px;
        }
        .signature-box {
          text-align: center;
        }
        .signature-line {
          border-top: 1px solid #333;
          margin: 30px auto 5px;
          width: 120px;
        }
        .signature-label {
          font-size: 10px;
          font-weight: bold;
          color: #333;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="school-name">École La Roseraie</div>
        <div class="bulletin-title">Bulletin Scolaire</div>
        <div style="font-size: 10px; color: #666;">Année Scolaire 2024-2025</div>
      </div>

      <div class="student-info">
        <div class="info-item">
          <span class="info-label">Nom et Prénom:</span> ${studentData.first_name} ${studentData.last_name}
        </div>
        <div class="info-item">
          <span class="info-label">Classe:</span> ${studentData.class}
        </div>
        <div class="info-item">
          <span class="info-label">Date de naissance:</span> ${new Date(studentData.date_of_birth).toLocaleDateString('fr-FR')}
        </div>
        <div class="info-item">
          <span class="info-label">Date d'édition:</span> ${new Date().toLocaleDateString('fr-FR')}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="text-align: left; width: 40%;">Matières</th>
            <th style="width: 20%;">Note</th>
            <th style="width: 20%;">Coefficient</th>
            <th style="width: 20%;">Points</th>
          </tr>
        </thead>
        <tbody>
          ${subjectNotes.map((subject: any) => {
            const gradeClass = subject.note >= 16 ? 'grade-excellent' : 
                              subject.note >= 12 ? 'grade-good' : 
                              subject.note >= 10 ? 'grade-average' : 'grade-poor';
            
            return `
              <tr>
                <td class="subject-column">${subject.subject} <small>(${subject.evaluationCount} éval.)</small></td>
                <td class="${gradeClass}">${subject.note.toFixed(1)}/20</td>
                <td>1</td>
                <td class="${gradeClass}">${subject.note.toFixed(1)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div class="summary">
        <div style="font-size: 14px;">Moyenne Générale</div>
        <div class="average-score">${overallAverage.toFixed(2)}/20</div>
        <div style="font-size: 12px;">
          Mention: ${overallAverage >= 16 ? 'Très Bien' : 
                     overallAverage >= 14 ? 'Bien' : 
                     overallAverage >= 12 ? 'Assez Bien' : 
                     overallAverage >= 10 ? 'Passable' : 'Insuffisant'}
        </div>
      </div>

      <div class="appreciation">
        <div class="appreciation-title">Appréciation de l'enseignant:</div>
        <div class="appreciation-text">
          ${overallAverage >= 16 ? 'Excellent travail ! L\'élève fait preuve d\'un très bon niveau et d\'une grande régularité dans ses efforts.' : 
            overallAverage >= 14 ? 'Bon travail. L\'élève montre de bonnes capacités et peut encore progresser avec plus de régularité.' : 
            overallAverage >= 12 ? 'Travail correct. L\'élève a les capacités nécessaires mais doit fournir des efforts plus soutenus.' : 
            overallAverage >= 10 ? 'Travail juste suffisant. L\'élève doit redoubler d\'efforts pour consolider ses acquis.' : 
            'Travail insuffisant. L\'élève doit impérativement revoir ses méthodes de travail et s\'investir davantage.'}
        </div>
      </div>

      <div class="signatures">
        <div class="signature-box">
          <div class="signature-line"></div>
          <div class="signature-label">L'Enseignant</div>
        </div>
        <div class="signature-box">
          <div class="signature-line"></div>
          <div class="signature-label">Le Directeur</div>
        </div>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    setTimeout(() => printWindow.close(), 1000);
  }
};

export const generateAnnualBulletin = (classResults: StudentAnnualResult[], className: string, stats: any) => {
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Résultats Annuels - Classe ${className}</title>
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        body { 
          font-family: Arial, sans-serif; 
          margin: 0;
          padding: 0;
          line-height: 1.4;
          font-size: 12px;
        }
        .header { 
          text-align: center; 
          border-bottom: 2px solid #2563eb; 
          padding-bottom: 10px; 
          margin-bottom: 15px; 
        }
        .school-name { 
          font-size: 20px; 
          font-weight: bold; 
          color: #2563eb; 
          margin-bottom: 5px;
        }
        .report-title { 
          font-size: 16px; 
          color: #333;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin: 15px 0;
        }
        .stat-box {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          text-align: center;
          border: 1px solid #ddd;
        }
        .stat-value {
          font-size: 18px;
          font-weight: bold;
          color: #2563eb;
        }
        .stat-label {
          font-size: 10px;
          color: #666;
          margin-top: 2px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 15px 0; 
          font-size: 10px;
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 4px 2px; 
          text-align: center; 
        }
        th { 
          background-color: #2563eb; 
          color: white; 
          font-weight: bold;
        }
        .student-name { 
          text-align: left; 
          font-weight: 500;
        }
        .mention-tb { color: #16a34a; font-weight: bold; }
        .mention-b { color: #2563eb; font-weight: bold; }
        .mention-ab { color: #f59e0b; font-weight: bold; }
        .mention-p { color: #f97316; font-weight: bold; }
        .mention-i { color: #dc2626; font-weight: bold; }
        .pass { color: #16a34a; font-weight: bold; }
        .fail { color: #dc2626; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="school-name">École La Roseraie</div>
        <div class="report-title">Résultats Annuels - Classe ${className}</div>
        <div style="font-size: 10px; color: #666;">Année Scolaire 2024-2025 - ${new Date().toLocaleDateString('fr-FR')}</div>
      </div>

      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-value">${stats.studentsEvaluated}/${stats.totalStudents}</div>
          <div class="stat-label">Élèves Évalués</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${stats.classAverage}/20</div>
          <div class="stat-label">Moyenne Classe</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${stats.passRate}%</div>
          <div class="stat-label">Taux de Réussite</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${stats.mentions['Très Bien'] + stats.mentions['Bien']}</div>
          <div class="stat-label">Mentions B/TB</div>
        </div>
      </div>

      <h3 style="margin: 20px 0 10px; color: #333;">Répartition des Mentions</h3>
      <div style="display: flex; gap: 15px; margin-bottom: 20px; font-size: 11px;">
        <span><strong>Très Bien:</strong> ${stats.mentions['Très Bien']}</span>
        <span><strong>Bien:</strong> ${stats.mentions['Bien']}</span>
        <span><strong>Assez Bien:</strong> ${stats.mentions['Assez Bien']}</span>
        <span><strong>Passable:</strong> ${stats.mentions['Passable']}</span>
        <span><strong>Insuffisant:</strong> ${stats.mentions['Insuffisant']}</span>
      </div>

      <table>
        <thead>
          <tr>
            <th style="text-align: left; width: 30%;">Élève</th>
            <th style="width: 12%;">Matières</th>
            <th style="width: 15%;">Éval. Complètes</th>
            <th style="width: 15%;">Moyenne</th>
            <th style="width: 18%;">Mention</th>
            <th style="width: 10%;">Passage</th>
          </tr>
        </thead>
        <tbody>
          ${classResults.map((result) => {
            const mentionClass = result.mention === 'Très Bien' ? 'mention-tb' :
                                result.mention === 'Bien' ? 'mention-b' :
                                result.mention === 'Assez Bien' ? 'mention-ab' :
                                result.mention === 'Passable' ? 'mention-p' : 'mention-i';
            
            return `
              <tr>
                <td class="student-name">${result.student_name}</td>
                <td>${result.totalSubjects}</td>
                <td>${result.subjectsWithAllEvaluations}/${result.totalSubjects}</td>
                <td><strong>${result.generalAverage}/20</strong></td>
                <td class="${mentionClass}">${result.mention}</td>
                <td class="${result.canPass ? 'pass' : 'fail'}">${result.canPass ? 'Admis' : 'Redouble'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div style="margin-top: 30px; text-align: center; font-size: 10px; color: #666;">
        <p>Ce document présente les résultats annuels basés sur la moyenne des 5 évaluations par matière</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    setTimeout(() => printWindow.close(), 1000);
  }
};
