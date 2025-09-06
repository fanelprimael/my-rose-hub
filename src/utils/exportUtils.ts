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

export const generateBulletin = (studentData: any, grades: any[], evaluation: string = 'Evaluation 1') => {
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bulletin de ${studentData.first_name} ${studentData.last_name} - ${evaluation}</title>
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
        <div class="bulletin-title">Bulletin Scolaire - ${evaluation}</div>
      </div>

      <div class="student-info">
        <div class="info-box">
          <strong>Élève:</strong> ${studentData.first_name} ${studentData.last_name}<br>
          <strong>Classe:</strong> ${studentData.class}<br>
          <strong>Année Scolaire:</strong> 2024-2025<br>
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
            <th>Évaluation 1</th>
            <th>Évaluation 2</th>
            <th>Évaluation 3</th>
            <th>Évaluation 4</th>
            <th>Évaluation 5</th>
            <th>Moyenne</th>
            <th>Coefficient</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          ${grades.map(grade => {
            const average = grade.average || 0;
            const gradeClass = average >= 16 ? 'grade-excellent' : 
                             average >= 12 ? 'grade-good' : 
                             average >= 10 ? 'grade-average' : 'grade-poor';
            
            return `
              <tr>
                <td class="subject">${grade.subject}</td>
                <td>${grade.eval1 || '-'}</td>
                <td>${grade.eval2 || '-'}</td>
                <td>${grade.eval3 || '-'}</td>
                <td>${grade.eval4 || '-'}</td>
                <td>${grade.eval5 || '-'}</td>
                <td class="${gradeClass}">${average.toFixed(1)}/20</td>
                <td>${grade.coefficient || 1}</td>
                <td class="${gradeClass}">${(average * (grade.coefficient || 1)).toFixed(1)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div class="summary">
        <strong>Résumé:</strong><br>
        Total des points: ${grades.reduce((sum, g) => sum + (g.average || 0) * (g.coefficient || 1), 0).toFixed(1)}<br>
        Total des coefficients: ${grades.reduce((sum, g) => sum + (g.coefficient || 1), 0)}<br>
        Moyenne générale: ${grades.length > 0 ? (grades.reduce((sum, g) => sum + (g.average || 0) * (g.coefficient || 1), 0) / grades.reduce((sum, g) => sum + (g.coefficient || 1), 0)).toFixed(2) : 0}/20
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <div style="border-top: 1px solid #000; margin-top: 40px; padding-top: 5px;">
            Directeur
          </div>
        </div>
        <div class="signature-box">
          <div style="border-top: 1px solid #000; margin-top: 40px; padding-top: 5px;">
            Parent/Tuteur
          </div>
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

export const generateClassicBulletin = (studentData: any, grades: any[], evaluation: string = 'Toutes évaluations') => {
  // Group grades by subject
  const subjectGrades = grades.reduce((acc: { [key: string]: any[] }, grade: any) => {
    if (!acc[grade.subject_name]) {
      acc[grade.subject_name] = [];
    }
    acc[grade.subject_name].push(grade);
    return acc;
  }, {} as { [key: string]: any[] });

  // Calculate averages per subject (coefficient = 1 for all)
  const subjectAverages = Object.entries(subjectGrades).map(([subject, subjectGradesList]) => {
    const average = (subjectGradesList as any[]).reduce((sum: number, grade: any) => sum + grade.grade, 0) / (subjectGradesList as any[]).length;
    return {
      subject,
      average: parseFloat(average.toFixed(2)),
      grades: subjectGradesList as any[]
    };
  });

  // Calculate overall average (simple: somme des moyennes / nombre de matières)
  const overallAverage = subjectAverages.length > 0 ? 
    subjectAverages.reduce((sum: number, subject: any) => sum + subject.average, 0) / subjectAverages.length : 0;

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bulletin Classique - ${studentData.first_name} ${studentData.last_name}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          line-height: 1.6;
        }
        .header { 
          text-align: center; 
          border-bottom: 3px solid #2563eb; 
          padding-bottom: 20px; 
          margin-bottom: 30px; 
        }
        .school-name { 
          font-size: 28px; 
          font-weight: bold; 
          color: #2563eb; 
          margin-bottom: 10px;
        }
        .bulletin-title { 
          font-size: 20px; 
          color: #333;
          margin-bottom: 5px;
        }
        .student-info { 
          background: #f8f9fa; 
          padding: 20px; 
          border-radius: 8px; 
          margin-bottom: 30px;
          border-left: 4px solid #2563eb;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .info-label {
          font-weight: bold;
          color: #333;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 30px 0; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 12px 8px; 
          text-align: center; 
        }
        th { 
          background-color: #2563eb; 
          color: white; 
          font-weight: bold;
          font-size: 14px;
        }
        .subject-column { 
          text-align: left; 
          font-weight: 500;
          background-color: #f8f9fa;
        }
        .grade-cell {
          font-weight: bold;
          font-size: 14px;
        }
        .grade-excellent { color: #16a34a; }
        .grade-good { color: #2563eb; }
        .grade-average { color: #f59e0b; }
        .grade-poor { color: #dc2626; }
        .summary { 
          background: linear-gradient(135deg, #2563eb, #1d4ed8); 
          color: white;
          padding: 20px; 
          border-radius: 8px; 
          margin: 30px 0; 
          text-align: center;
        }
        .average-score {
          font-size: 24px;
          font-weight: bold;
          margin: 10px 0;
        }
        .signature-section { 
          margin-top: 60px; 
          text-align: center;
        }
        .signature-line {
          border-top: 2px solid #333;
          margin: 60px auto 10px;
          width: 200px;
        }
        .signature-label {
          font-weight: bold;
          color: #333;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="school-name">École La Roseraie</div>
        <div class="bulletin-title">Bulletin Classique</div>
        <div style="font-size: 14px; color: #666;">Année Scolaire 2024-2025</div>
      </div>

      <div class="student-info">
        <div class="info-row">
          <span class="info-label">Nom et Prénom:</span>
          <span>${studentData.first_name} ${studentData.last_name}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Classe:</span>
          <span>${studentData.class}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Date de naissance:</span>
          <span>${new Date(studentData.date_of_birth).toLocaleDateString('fr-FR')}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Date d'édition:</span>
          <span>${new Date().toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="text-align: left;">Matières</th>
            <th>Notes Obtenues</th>
            <th>Moyenne</th>
            <th>Coefficient</th>
          </tr>
        </thead>
        <tbody>
          ${subjectAverages.map((subjectData: any) => {
            const gradeClass = subjectData.average >= 16 ? 'grade-excellent' : 
                              subjectData.average >= 12 ? 'grade-good' : 
                              subjectData.average >= 10 ? 'grade-average' : 'grade-poor';
            
            const gradesText = (subjectData.grades as any[]).map((g: any) => `${g.grade}`).join(' - ');
            
            return `
              <tr>
                <td class="subject-column">${subjectData.subject}</td>
                <td>${gradesText}</td>
                <td class="grade-cell ${gradeClass}">${subjectData.average.toFixed(1)}/20</td>
                <td>1</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div class="summary">
        <div style="font-size: 18px; margin-bottom: 10px;">Résultats</div>
        <div class="average-score">${overallAverage.toFixed(2)}/20</div>
        <div style="font-size: 16px;">Moyenne Générale</div>
        <div style="margin-top: 15px; font-size: 14px;">
          Mention: ${overallAverage >= 16 ? 'Très Bien' : 
                     overallAverage >= 14 ? 'Bien' : 
                     overallAverage >= 12 ? 'Assez Bien' : 
                     overallAverage >= 10 ? 'Passable' : 'Insuffisant'}
        </div>
      </div>

      <div class="signature-section">
        <div class="signature-line"></div>
        <div class="signature-label">Le Directeur / La Directrice</div>
      </div>

      <div class="footer">
        Bulletin généré automatiquement le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
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