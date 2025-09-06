// Utility functions for exporting data to PDF and Excel formats

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
  // Group grades by subject and take the most recent grade per subject
  const subjectGrades = grades.reduce((acc: { [key: string]: any }, grade: any) => {
    if (!acc[grade.subject_name] || new Date(grade.created_at) > new Date(acc[grade.subject_name].created_at)) {
      acc[grade.subject_name] = grade;
    }
    return acc;
  }, {} as { [key: string]: any });

  // Convert to array and get the grade for each subject
  const subjectNotes = Object.values(subjectGrades).map((grade: any) => ({
    subject: grade.subject_name,
    note: grade.grade
  }));

  // Calculate overall average (simple: somme des notes / nombre de matières)
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
                <td class="subject-column">${subject.subject}</td>
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

export const generateEvaluationBulletin = (studentData: any, grades: any[], evaluation: string) => {
  // Filter grades for the specific evaluation
  const evaluationGrades = grades.filter((grade: any) => grade.evaluation === evaluation);
  
  // Group grades by subject
  const subjectGrades = evaluationGrades.reduce((acc: { [key: string]: any[] }, grade: any) => {
    if (!acc[grade.subject_name]) {
      acc[grade.subject_name] = [];
    }
    acc[grade.subject_name].push(grade);
    return acc;
  }, {} as { [key: string]: any[] });

  // Calculate averages per subject
  const subjectAverages = Object.entries(subjectGrades).map(([subject, subjectGradesList]) => {
    const average = (subjectGradesList as any[]).reduce((sum: number, grade: any) => sum + grade.grade, 0) / (subjectGradesList as any[]).length;
    const coefficient = (subjectGradesList[0] as any)?.coefficient || 1;
    return {
      subject,
      average: parseFloat(average.toFixed(2)),
      coefficient,
      points: parseFloat((average * coefficient).toFixed(2)),
      grades: subjectGradesList as any[]
    };
  });

  // Calculate overall average
  const totalPoints = subjectAverages.reduce((sum: number, subject: any) => sum + subject.points, 0);
  const totalCoefficients = subjectAverages.reduce((sum: number, subject: any) => sum + subject.coefficient, 0);
  const overallAverage = totalCoefficients > 0 ? totalPoints / totalCoefficients : 0;

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bulletin ${evaluation} - ${studentData.first_name} ${studentData.last_name}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .school-name { font-size: 24px; font-weight: bold; color: #2563eb; }
        .bulletin-title { font-size: 18px; margin-top: 10px; }
        .student-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .info-box { background: #f8f9fa; padding: 10px; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
        th { background-color: #2563eb; color: white; }
        .subject { text-align: left; }
        .grade-excellent { color: #16a34a; font-weight: bold; }
        .grade-good { color: #2563eb; font-weight: bold; }
        .grade-average { color: #f59e0b; font-weight: bold; }
        .grade-poor { color: #dc2626; font-weight: bold; }
        .summary { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; }
        .signature-section { display: flex; justify-content: space-between; margin-top: 40px; }
        .signature-box { text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="school-name">École La Roseraie</div>
        <div class="bulletin-title">Bulletin - ${evaluation}</div>
      </div>

      <div class="student-info">
        <div class="info-box">
          <strong>Élève:</strong> ${studentData.first_name} ${studentData.last_name}<br>
          <strong>Classe:</strong> ${studentData.class}<br>
          <strong>Évaluation:</strong> ${evaluation}
        </div>
        <div class="info-box">
          <strong>Date de naissance:</strong> ${new Date(studentData.date_of_birth).toLocaleDateString('fr-FR')}<br>
          <strong>Genre:</strong> ${studentData.gender || 'Non spécifié'}<br>
          <strong>Date d'édition:</strong> ${new Date().toLocaleDateString('fr-FR')}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th class="subject">Matière</th>
            <th>Notes</th>
            <th>Moyenne</th>
            <th>Coefficient</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          ${subjectAverages.map((subjectData: any) => {
            const gradeClass = subjectData.average >= 16 ? 'grade-excellent' : 
                              subjectData.average >= 12 ? 'grade-good' : 
                              subjectData.average >= 10 ? 'grade-average' : 'grade-poor';
            
            const gradesText = (subjectData.grades as any[]).map((g: any) => `${g.grade}/20 (${g.type})`).join(', ');
            
            return `
              <tr>
                <td class="subject">${subjectData.subject}</td>
                <td>${gradesText}</td>
                <td class="${gradeClass}">${subjectData.average.toFixed(1)}/20</td>
                <td>${subjectData.coefficient}</td>
                <td class="${gradeClass}">${subjectData.points.toFixed(1)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div class="summary">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>Moyenne Générale: ${overallAverage.toFixed(2)}/20</strong>
          </div>
          <div>
            <strong>Mentions:</strong> 
            ${overallAverage >= 16 ? 'Très Bien' : 
              overallAverage >= 14 ? 'Bien' : 
              overallAverage >= 12 ? 'Assez Bien' : 
              overallAverage >= 10 ? 'Passable' : 'Insuffisant'}
          </div>
        </div>
        <br>
        <div>
          <strong>Observations:</strong><br>
          ${overallAverage >= 14 ? 'Excellent travail ! Continuez ainsi.' : 
            overallAverage >= 12 ? 'Bon travail, peut mieux faire.' : 
            overallAverage >= 10 ? 'Travail correct, des efforts sont nécessaires.' : 
            'Des efforts importants sont nécessaires pour progresser.'}
        </div>
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <br><br>
          <hr style="width: 150px;">
          <p>Signature du Professeur</p>
        </div>
        <div class="signature-box">
          <br><br>
          <hr style="width: 150px;">
          <p>Signature du Directeur</p>
        </div>
        <div class="signature-box">
          <br><br>
          <hr style="width: 150px;">
          <p>Signature des Parents</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
    };
    
    setTimeout(() => printWindow.close(), 1000);
  }
};