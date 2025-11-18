document.addEventListener('DOMContentLoaded', () => {
    let tasks = JSON.parse(localStorage.getItem('monitoramentoTasks')) || [];
    let archivedTasks = JSON.parse(localStorage.getItem('archivedTasks')) || [];
    let categories = JSON.parse(localStorage.getItem('monitoramentoCategorias')) || ['Furto', 'Fraude Pagamento', 'Consumo Indevido', 'Vandalismo', 'Outros'];

    tasks.forEach(t => {
        if (t.isExpanded === undefined) {
            t.isExpanded = true;
        }
    });

    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const taskForm = document.getElementById('task-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const formCondominioInput = document.getElementById('form-condominio');
    const autocompleteList = document.getElementById('autocomplete-list');
    
    const bulkAddBtn = document.getElementById('bulk-add-btn');
    const bulkAddModal = document.getElementById('bulk-add-modal');
    const bulkAddForm = document.getElementById('bulk-add-form');
    const bulkCancelBtn = document.getElementById('bulk-cancel-btn');
    const bulkInputArea = document.getElementById('bulk-input-area');

    const ocorrenciaModal = document.getElementById('ocorrencia-modal');
    const ocorrenciaForm = document.getElementById('ocorrencia-form');
    const ocorrenciaCancelBtn = document.getElementById('ocorrencia-cancel-btn');
    const ocorrenciaListDiv = document.getElementById('ocorrencia-list');
    const addOcorrenciaBtn = document.getElementById('add-ocorrencia-btn');
    const addOcorrenciaCategoriaSelect = document.getElementById('add-ocorrencia-categoria');
    const addOcorrenciaInconclusiva = document.getElementById('add-ocorrencia-inconclusiva');

    const renameCondoBtn = document.getElementById('rename-condo-btn');
    const renameModal = document.getElementById('rename-modal');
    const renameForm = document.getElementById('rename-form');
    const renameCancelBtn = document.getElementById('rename-cancel-btn');
    const oldNameSelect = document.getElementById('form-old-name');
    const newNameInput = document.getElementById('form-new-name');

    const filtroCondominio = document.getElementById('filtro-condominio');
    const filtroData = document.getElementById('filtro-data');
    const filtroSemana = document.getElementById('filtro-semana');
    const filtroBackup = document.getElementById('filtro-backup');
    const filtroAnalise = document.getElementById('filtro-analise');

    const expandAllBtn = document.getElementById('expand-all-btn');
    const collapseAllBtn = document.getElementById('collapse-all-btn');
    
    const restoreBtn = document.getElementById('restore-btn');
    const restoreInput = document.getElementById('restore-input');
    const restoreConfirmModal = document.getElementById('restore-confirm-modal');
    const restoreConfirmCancelBtn = document.getElementById('restore-confirm-cancel-btn');
    const restoreConfirmProceedBtn = document.getElementById('restore-confirm-proceed-btn');
    let fileToRestore = null;
    
    const notificationModal = document.getElementById('notification-modal');
    const notificationMessage = document.getElementById('notification-message');
    const notificationCloseBtn = document.getElementById('notification-close-btn');

    const periodAnalysisBtn = document.getElementById('period-analysis-btn');
    const periodAnalysisModal = document.getElementById('period-analysis-modal');
    const periodAnalysisCloseBtn = document.getElementById('period-analysis-close-btn');
    const periodStartDateInput = document.getElementById('period-start-date');
    const periodEndDateInput = document.getElementById('period-end-date');
    const generateReportBtn = document.getElementById('generate-report-btn');
    const periodResultsContent = document.getElementById('period-results-content');
    const periodTaskList = document.getElementById('period-task-list');
    const periodCategoryFilter = document.getElementById('period-category-filter');

    const priorityBtn = document.getElementById('priority-btn');
    const priorityModal = document.getElementById('priority-modal');
    const priorityCloseBtn = document.getElementById('priority-close-btn');
    const priorityTaskList = document.getElementById('priority-task-list');

    const pdvDashboardBtn = document.getElementById('pdv-dashboard-btn');
    const pdvDashboardModal = document.getElementById('pdv-dashboard-modal');
    const pdvDashboardCloseBtn = document.getElementById('pdv-dashboard-close-btn');
    const pdvSelect = document.getElementById('pdv-select');
    const pdvContent = document.getElementById('pdv-content');

    const plannerBtn = document.getElementById('planner-btn');
    const plannerModal = document.getElementById('planner-modal');
    const plannerCancelBtn = document.getElementById('planner-cancel-btn');
    const plannerForm = document.getElementById('planner-form');
    const plannerWeekNumberInput = document.getElementById('planner-week-number');
    const plannerListContainer = document.getElementById('planner-list-container');
    
    const categoryBtn = document.getElementById('category-btn');
    const categoryModal = document.getElementById('category-modal');
    const categoryCloseBtn = document.getElementById('category-close-btn');
    const addCategoryForm = document.getElementById('add-category-form');
    const newCategoryNameInput = document.getElementById('new-category-name');
    const categoryListContainer = document.getElementById('category-list-container');
    
    const archiveBtn = document.getElementById('archive-btn');
    const archiveModal = document.getElementById('archive-modal');
    const archiveForm = document.getElementById('archive-form');
    const archiveCancelBtn = document.getElementById('archive-cancel-btn');
    const viewArchiveBtn = document.getElementById('view-archive-btn');
    const viewArchiveModal = document.getElementById('view-archive-modal');
    const viewArchiveCloseBtn = document.getElementById('view-archive-close-btn');
    const viewArchiveListContainer = document.getElementById('view-archive-list-container');
    const unarchiveSelectedBtn = document.getElementById('unarchive-selected-btn');
    const archiveSearchInput = document.getElementById('archive-search-input');
    
    const annualReportBtn = document.getElementById('annual-report-btn');
    const annualReportModal = document.getElementById('annual-report-modal');
    const annualReportCloseBtn = document.getElementById('annual-report-close-btn');

    const actionsMenuContainer = document.getElementById('actions-menu-container');
    const actionsMenuBtn = document.getElementById('actions-menu-btn');
    const actionsMenu = document.getElementById('actions-menu');

    let ocorrenciasChart;
    let periodChart;
    let periodCategoryChart;
    let pdvTrendChart;
    let annualMonthlyChart, annualCategoryChart, annualCondoChart;

    const saveTasks = () => {
        localStorage.setItem('monitoramentoTasks', JSON.stringify(tasks));
        localStorage.setItem('archivedTasks', JSON.stringify(archivedTasks));
    };
    
    const saveCategories = () => {
        localStorage.setItem('monitoramentoCategorias', JSON.stringify(categories));
    };

    const showNotification = (message) => {
        notificationMessage.textContent = message;
        notificationModal.classList.remove('hidden');
    };

    notificationCloseBtn.addEventListener('click', () => {
        notificationModal.classList.add('hidden');
    });
    
    // *** 1. SUBSTITUIÇÃO: statusClasses ***
    const statusClasses = {
        Pendente: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
        'Em Andamento': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        Concluído: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
        'Em Análise': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        Concluída: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
        'Não visualizar': 'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300',
    };

    // *** 2. SUBSTITUIÇÃO: multiOcColors ***
    const multiOcColors = ['#592b2b', '#2b4f4f', '#2b3f54', '#594a3a', '#59394a', '#59573a'];

    const formatDate = (dateString, options = {}) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('pt-BR', options);
    };
    
    const formatDateForInput = (date) => {
         return date.toISOString().split('T')[0];
    };

    const getWeekNumber = (d) => {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    };
    
      const getDateOfISOWeek = (w, y) => {
        var simple = new Date(y, 0, 1 + (w - 1) * 7);
        var dow = simple.getDay();
        var ISOweekStart = simple;
        if (dow <= 4) {
            ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
        } else {
            ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
        }
        return ISOweekStart;
    }

    // *** 5. SUBSTITUIÇÃO: renderTasks ***
    const renderTasks = () => {
         const currentWeekFilter = filtroSemana.value ? parseInt(filtroSemana.value) : null;
        const filteredTasks = tasks.filter(task => {
            const matchCondominio = task.condominio.toLowerCase().includes(filtroCondominio.value.toLowerCase());
            const matchData = !filtroData.value || task.dataAnalise === filtroData.value;
            const matchBackup = !filtroBackup.value || task.statusBackup === filtroBackup.value;
            const matchAnalise = !filtroAnalise.value || task.statusAnalise === filtroAnalise.value;

            let matchSemana = !currentWeekFilter;
            if (currentWeekFilter && !filtroData.value) {
                matchSemana = (task.semanaDeTrabalho === currentWeekFilter); 
            }

            if (filtroData.value) {
                matchSemana = true;
            }

            return matchCondominio && matchData && matchBackup && matchAnalise && matchSemana;
        });

        taskList.innerHTML = '';
        if(filteredTasks.length === 0) {
            taskList.innerHTML = `<p class="text-slate-500 dark:text-slate-400 text-center col-span-full">Nenhuma tarefa encontrada.</p>`;
        } else {
            filteredTasks.forEach(task => {
                const card = document.createElement('div');
                card.className = 'bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border-l-4';
                card.style.borderColor = task.statusAnalise === 'Pendente' ? '#f59e0b' : (task.statusAnalise === 'Em Análise' ? '#f97316' : '#10b981');

                const isCollapsed = !task.isExpanded;

                let ocorrenciaDetailsHTML = '';
                if (task.ocorrencia === 'Sim' && task.ocorrencias && task.ocorrencias.length > 0) {
                    ocorrenciaDetailsHTML += `<div class="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">`;
                    task.ocorrencias.forEach(ocor => {
                        const inconclusivaBadge = ocor.isInconclusiva ? `<span class="text-xs font-semibold text-white bg-slate-400 dark:bg-slate-500 px-2 py-0.5 rounded-full ml-2">Inconclusiva</span>` : '';
                        ocorrenciaDetailsHTML += `
                         <div class="p-2 bg-red-50 dark:bg-red-900/40 rounded-md">
                             <p class="text-sm font-semibold text-red-800 dark:text-red-200">${ocor.categoria || 'Sem Categoria'}</p>
                             <p class="text-sm text-red-700 dark:text-red-300">${ocor.desc}</p>
                             <div class="flex items-center mt-1">
                                 <p class="text-xs text-red-600 dark:text-red-400"><strong>Horário:</strong> ${ocor.horarioInicial || 'N/A'} - ${ocor.horarioFinal || 'N/A'}</p>
                                 ${inconclusivaBadge}
                             </div>
                         </div>
                        `;
                    });
                    ocorrenciaDetailsHTML += `</div>`;
                }

                let detailsButtonHTML = '';
                if (task.statusAnalise === 'Em Análise' || task.statusAnalise === 'Concluída') {
                     const buttonText = task.statusAnalise === 'Concluída' ? 'Ver / Editar Ocorrências' : 'Registrar Ocorrências';
                     detailsButtonHTML = `<button data-id="${task.id}" class="edit-ocorrencia-btn mt-4 w-full text-sm bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">${buttonText}</button>`;
                }

                let occurrenceCountHTML = '';
                let completionDateHTML = '';
                if (task.statusAnalise === 'Concluída') {
                    const count = task.ocorrencias ? task.ocorrencias.length : 0;
                    occurrenceCountHTML = `<div class="mt-2 text-sm font-bold ${count > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}">Ocorrências: ${count}</div>`;
                    if (task.dataConclusao) {
                        completionDateHTML = `<div class="text-xs text-emerald-600 dark:text-emerald-500 font-medium mt-1">Concluído em: ${formatDate(task.dataConclusao)}</div>`;
                    }
                }


                card.innerHTML = `
                    <div class="flex justify-between items-start">
                        <h3 class="font-bold text-lg text-slate-800 dark:text-slate-200 flex-1 pr-2">${task.condominio}</h3>
                        <div class="flex items-center gap-2 flex-shrink-0">
                            <span class="text-xs font-semibold px-2 py-1 rounded-full ${task.ocorrencia === 'Sim' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : (task.ocorrencia === 'Não' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300')}">${task.ocorrencia || 'Pendente'}</span>
                            <button data-id="${task.id}" class="archive-single-btn text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 font-bold text-lg leading-none flex-shrink-0" title="Arquivar esta análise">&#128450;</button>
                            <button data-id="${task.id}" class="delete-task-btn text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-bold text-xl leading-none flex-shrink-0" title="Excluir esta análise">&times;</button>
                        </div>
                    </div>
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="text-sm text-slate-500 dark:text-slate-400">Analisar data: <strong>${formatDate(task.dataAnalise)}</strong></p>
                            ${task.semanaDeTrabalho ? `<p class="text-xs text-orange-600 dark:text-orange-400 font-medium">Semana de Trabalho: <strong>${task.semanaDeTrabalho}</strong></p>` : ''}
                        </div>
                        <button data-id="${task.id}" class="toggle-details-btn p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 ${isCollapsed ? 'collapsed' : ''}">
                            <svg class="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                    </div>
                    <div class="details-content ${isCollapsed ? 'hidden' : ''}">
                        ${occurrenceCountHTML}
                        ${completionDateHTML}

                        <div class="space-y-3 text-sm mt-4">
                            <div class="flex items-center justify-between"><span class="font-semibold text-slate-600 dark:text-slate-400">Backup:</span><select data-id="${task.id}" data-type="backup" class="status-select border-none text-right font-semibold text-sm rounded-md p-1 ${statusClasses[task.statusBackup]}"><option value="Pendente" ${task.statusBackup === 'Pendente' ? 'selected' : ''}>Pendente</option><option value="Em Andamento" ${task.statusBackup === 'Em Andamento' ? 'selected' : ''}>Em Andamento</option><option value="Concluído" ${task.statusBackup === 'Concluído' ? 'selected' : ''}>Concluído</option><option value="Não visualizar" ${task.statusBackup === 'Não visualizar' ? 'selected' : ''}>Não visualizar</option></select></div>
                            <div class="flex items-center justify-between"><span class="font-semibold text-slate-600 dark:text-slate-400">Análise:</span><select data-id="${task.id}" data-type="analise" class="status-select border-none text-right font-semibold text-sm rounded-md p-1 ${statusClasses[task.statusAnalise]}"><option value="Pendente" ${task.statusAnalise === 'Pendente' ? 'selected' : ''}>Pendente</option><option value="Em Análise" ${task.statusAnalise === 'Em Análise' ? 'selected' : ''}>Em Análise</option><option value="Concluída" ${task.statusAnalise === 'Concluída' ? 'selected' : ''}>Concluída</option><option value="Não visualizar" ${task.statusAnalise === 'Não visualizar' ? 'selected' : ''}>Não visualizar</option></select></div>
                        </div>
                        ${ocorrenciaDetailsHTML}
                        ${detailsButtonHTML}
                    </div>
                `;
                taskList.appendChild(card);
            });
        }
    };
    
    const updateDashboard = () => {
        const currentWeekFilter = filtroSemana.value ? parseInt(filtroSemana.value) : null;
        const filteredTasks = tasks.filter(task => {
            const matchCondominio = task.condominio.toLowerCase().includes(filtroCondominio.value.toLowerCase());
            const matchData = !filtroData.value || task.dataAnalise === filtroData.value;
            const matchBackup = !filtroBackup.value || task.statusBackup === filtroBackup.value;
            const matchAnalise = !filtroAnalise.value || task.statusAnalise === filtroAnalise.value;
            let matchSemana = true;
             if (currentWeekFilter && !filtroData.value) {
                matchSemana = (task.semanaDeTrabalho === currentWeekFilter); 
             }
            if (filtroData.value) {
                matchSemana = true; 
            }
            return matchCondominio && matchData && matchBackup && matchAnalise && matchSemana;
        });
        
        document.getElementById('total-solicitacoes').textContent = filteredTasks.length;
        document.getElementById('backups-pendentes').textContent = filteredTasks.filter(t => t.statusBackup === 'Pendente').length;
        document.getElementById('analises-pendentes').textContent = filteredTasks.filter(t => t.statusAnalise === 'Pendente').length;
        
        const today = new Date();
        const dayOfWeek = today.getDay() || 7;
        const monday = new Date(today);
        monday.setDate(today.getDate() - dayOfWeek + 1);
        monday.setHours(0, 0, 0, 0);
        
        const currentDay = new Date();
        currentDay.setHours(23, 59, 59, 999);

        const completedThisWeek = tasks.filter(task => 
            task.dataConclusao && 
            new Date(task.dataConclusao + 'T00:00:00') >= monday &&
            new Date(task.dataConclusao + 'T00:00:00') <= currentDay
        );

        const totalCompleted = completedThisWeek.length;
        const totalOccurrencesWeek = completedThisWeek.reduce((acc, task) => acc + (task.ocorrencias ? task.ocorrencias.length : 0), 0);

        document.getElementById('total-ocorrencias-semana').textContent = totalOccurrencesWeek;

        const productivityMetric = totalCompleted > 0 ? (totalOccurrencesWeek / totalCompleted).toFixed(1) : '0.0'; 
        document.getElementById('produtividade-semanal').textContent = productivityMetric; 
    };
    
    const updateCharts = () => {
        const today = new Date();
        const dayOfWeek = today.getDay() || 7;
        const monday = new Date(today);
        monday.setDate(today.getDate() - dayOfWeek + 1);
        monday.setHours(0, 0, 0, 0);
        
        const currentDay = new Date();
        currentDay.setHours(23, 59, 59, 999);

        const completedThisWeek = tasks.filter(task => 
            task.dataConclusao && 
            new Date(task.dataConclusao + 'T00:00:00') >= monday &&
            new Date(task.dataConclusao + 'T00:00:00') <= currentDay
        );
        
        const dataByCondo = completedThisWeek.reduce((acc, task) => {
            if (!acc[task.condominio]) acc[task.condominio] = { ocorrencias: 0 };
            if (task.ocorrencia === 'Sim' && task.ocorrencias) acc[task.condominio].ocorrencias += task.ocorrencias.length;
            return acc;
        }, {});

        const labels = Object.keys(dataByCondo);
        const ocorrenciasData = labels.map(label => dataByCondo[label].ocorrencias);
        if (ocorrenciasChart) {
            ocorrenciasChart.data.labels = labels;
            ocorrenciasChart.data.datasets[0].data = ocorrenciasData;
            ocorrenciasChart.update();
        }
    };

    // *** 3. SUBSTITUIÇÃO: setupCharts ***
    const setupCharts = () => {
        // LINHAS ADICIONADAS
        const isDarkMode = document.documentElement.classList.contains('dark');
        const chartTextColor = isDarkMode ? '#cbd5e1' : '#334155'; // slate-300 / slate-700
        const chartBorderColor = isDarkMode ? '#475569' : '#e2e8f0'; // slate-600 / slate-200
        Chart.defaults.color = chartTextColor;
        Chart.defaults.borderColor = chartBorderColor;
        // FIM DAS LINHAS ADICIONADAS

        const ocorrenciasCtx = document.getElementById('ocorrenciasChart').getContext('2d');
        ocorrenciasChart = new Chart(ocorrenciasCtx, {
            type: 'bar', data: { labels: [], datasets: [{ label: '# de Ocorrências', data: [], backgroundColor: 'rgba(249, 115, 22, 0.6)', borderColor: 'rgba(249, 115, 22, 1)', borderWidth: 1 }] },
            options: { maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
        });
        
        const periodCtx = document.getElementById('periodChart').getContext('2d');
        periodChart = new Chart(periodCtx, {
            type: 'bar', data: { labels: [], datasets: [{ label: '# de Ocorrências', data: [], backgroundColor: 'rgba(249, 115, 22, 0.6)', borderColor: 'rgba(249, 115, 22, 1)', borderWidth: 1 }] },
            options: { maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
        });

        const periodCategoryCtx = document.getElementById('periodCategoryChart').getContext('2d');
        periodCategoryChart = new Chart(periodCategoryCtx, {
            type: 'pie', data: { labels: [], datasets: [{ label: 'Ocorrências por Categoria', data: [], backgroundColor: ['#ea580c', '#f97316', '#f7b41e', '#fbbf24', '#fcd34d', '#fed7aa', '#ffedd5'] }] },
            options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
        
        const pdvTrendCtx = document.getElementById('pdvTrendChart').getContext('2d');
        pdvTrendChart = new Chart(pdvTrendCtx, {
            type: 'line',
            data: { labels: [], datasets: [{ label: 'Ocorrências por Mês', data: [], borderColor: 'rgba(249, 115, 22, 1)', backgroundColor: 'rgba(249, 115, 22, 0.1)', fill: true, tension: 0.1 }] },
            options: { maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { precision: 0 } }, x: { type: 'time', time: { unit: 'month', displayFormats: { month: 'MMM/yy' } } } } }
        });
        
        const annualMonthlyCtx = document.getElementById('annualReportChart_Monthly').getContext('2d');
        annualMonthlyChart = new Chart(annualMonthlyCtx, {
            type: 'bar', data: { labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], datasets: [{ label: 'Ocorrências por Mês', data: [], backgroundColor: 'rgba(239, 68, 68, 0.6)', borderColor: 'rgba(239, 68, 68, 1)', borderWidth: 1 }] },
            options: { maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
        });
        
        const annualCategoryCtx = document.getElementById('annualReportChart_Category').getContext('2d');
        annualCategoryChart = new Chart(annualCategoryCtx, {
            type: 'doughnut', data: { labels: [], datasets: [{ label: 'Ocorrências por Categoria', data: [], backgroundColor: ['#ea580c', '#f97316', '#f7b41e', '#fbbf24', '#fcd34d', '#fed7aa', '#ffedd5'] }] },
            options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });

        const annualCondoCtx = document.getElementById('annualReportChart_Condo').getContext('2d');
        annualCondoChart = new Chart(annualCondoCtx, {
            type: 'bar', data: { labels: [], datasets: [{ label: 'Top 10 Condomínios', data: [], backgroundColor: 'rgba(249, 115, 22, 0.6)', borderColor: 'rgba(249, 115, 22, 1)', borderWidth: 1 }] },
            options: { maintainAspectRatio: false, indexAxis: 'y', scales: { x: { beginAtZero: true, ticks: { precision: 0 } } } }
        });
    };

    const refreshUI = () => {
        saveTasks();
        renderTasks();
        updateDashboard();
        updateCharts();
    };
    
    [filtroCondominio, filtroData, filtroSemana, filtroBackup, filtroAnalise].forEach(el => el.addEventListener('input', refreshUI));

    filtroSemana.addEventListener('input', () => {
        if (filtroSemana.value) {
            filtroData.value = '';
            filtroData.disabled = true;
        } else {
            filtroData.disabled = false;
        }
    });
    filtroData.addEventListener('input', () => {
         if (filtroData.value) {
            filtroSemana.value = '';
            filtroSemana.disabled = true;
        } else {
            filtroSemana.disabled = false;
        }
    });


    addTaskBtn.addEventListener('click', () => {
        document.getElementById('form-semana-trabalho').value = getWeekNumber(new Date());
        taskModal.classList.remove('hidden')
    });
    cancelBtn.addEventListener('click', () => {
        taskModal.classList.add('hidden');
        autocompleteList.classList.add('hidden');
    });
    ocorrenciaCancelBtn.addEventListener('click', () => {
         const editingItem = ocorrenciaListDiv.querySelector('.ocorrencia-item.editing');
        if (editingItem) {
            const cancelBtn = editingItem.querySelector('.cancel-edit-ocorrencia-btn');
            if(cancelBtn) cancelBtn.click();
        }
        ocorrenciaModal.classList.add('hidden');
    });


    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const today = new Date().toISOString().split('T')[0];
        const newTask = {
            id: Date.now(), dataSolicitacao: today, condominio: document.getElementById('form-condominio').value,
            dataAnalise: document.getElementById('form-data-analise').value,
            semanaDeTrabalho: parseInt(document.getElementById('form-semana-trabalho').value) || null,
            statusBackup: 'Pendente', dataBackup: '',
            statusAnalise: 'Pendente', ocorrencia: null, ocorrencias: [], acao: '',
            obs: document.getElementById('form-observacoes').value,
            isExpanded: true,
            dataConclusao: null,
        };
        tasks.push(newTask);
        taskForm.reset();
        taskModal.classList.add('hidden');
        autocompleteList.classList.add('hidden');
        refreshUI();
    });

    bulkAddBtn.addEventListener('click', () => {
        bulkAddModal.classList.remove('hidden');
    });

    bulkCancelBtn.addEventListener('click', () => {
        bulkAddModal.classList.add('hidden');
    });

    bulkAddForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputText = bulkInputArea.value.trim();
        
        if (!inputText) {
             showNotification("Por favor, cole os dados da planilha.");
            return;
        }

        const lines = inputText.split('\n');
        const today = new Date().toISOString().split('T')[0];
        let newTasksCount = 0;
        let skippedCount = 0;
        let archivedCount = 0;

        const headers = lines[0].split('\t').map(h => h.trim().toLowerCase());
        
        const idxSemana = headers.findIndex(h => h.includes('semana'));
        const idxData = headers.findIndex(h => h.includes('dia a visualizar'));
        const idxUnidade = headers.findIndex(h => h.includes('unidade'));
        const idxStatus = headers.findIndex(h => h.includes('status'));
        const idxOC = headers.findIndex(h => h === 'oc' || h === 'ocorrências');

        if (idxData === -1 || idxUnidade === -1 || idxStatus === -1 || idxSemana === -1) {
            showNotification("Erro: Colunas 'Semana', 'Dia a visualizar', 'Unidade' ou 'Status' não encontradas. Verifique o cabeçalho.");
            return;
        }

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line.trim()) continue;

            const columns = line.split('\t');
            
            const dataStr = columns[idxData] ? columns[idxData].trim() : '';
            const condominio = columns[idxUnidade] ? columns[idxUnidade].trim() : '';
            const status = columns[idxStatus] ? columns[idxStatus].trim().toLowerCase() : 'pendente';
            const ocCount = idxOC !== -1 ? (parseInt(columns[idxOC]) || 0) : 0;
            const semanaTrabalho = columns[idxSemana] ? (parseInt(columns[idxSemana].replace('Semana', '')) || null) : null;
            
            if (!dataStr || !condominio || !semanaTrabalho) {
                console.warn(`Linha ignorada (dados essenciais faltando): "${line}"`);
                continue;
            }

            const dateParts = dataStr.split('/');
            if (dateParts.length !== 3 || dateParts[2].length < 4 || isNaN(parseInt(dateParts[0])) || isNaN(parseInt(dateParts[1])) || isNaN(parseInt(dateParts[2]))) {
               console.warn(`Linha ignorada (formato de data inválido): "${line}"`);
               continue;
            }
            const formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
            
            const isDuplicate = tasks.some(task => task.condominio === condominio && task.dataAnalise === formattedDate) || 
                                archivedTasks.some(task => task.condominio === condominio && task.dataAnalise === formattedDate);

            if (isDuplicate) {
                skippedCount++;
                continue;
            }

            let taskOcorrencias = [];
            if (ocCount > 0) {
                for(let j=0; j < ocCount; j++) {
                    taskOcorrencias.push({
                        id: Date.now() + i + j,
                        categoria: 'Importada',
                        desc: 'Ocorrência importada da planilha',
                        horarioInicial: '',
                        horarioFinal: '',
                        isInconclusiva: false
                    });
                }
            }

            const newTask = {
                id: Date.now() + i,
                dataSolicitacao: today,
                condominio: condominio,
                dataAnalise: formattedDate,
                semanaDeTrabalho: semanaTrabalho,
                statusBackup: status === 'finalizado' || status === 'finalizada' ? 'Concluído' : 'Pendente',
                dataBackup: '',
                statusAnalise: status === 'finalizado' || status === 'finalizada' ? 'Concluída' : 'Pendente',
                ocorrencia: ocCount > 0 ? 'Sim' : 'Não',
                ocorrencias: taskOcorrencias,
                acao: '',
                obs: 'Importado da planilha',
                isExpanded: true,
                dataConclusao: status === 'finalizado' || status === 'finalizada' ? formattedDate : null,
            };

            if (status === 'finalizado' || status === 'finalizada') {
                archivedTasks.push(newTask);
                archivedCount++;
            } else {
                tasks.push(newTask);
                newTasksCount++;
            }
        }
        
        bulkAddModal.classList.add('hidden');
        bulkAddForm.reset();
        
        refreshUI();
        showNotification(`${newTasksCount} análises ativas e ${archivedCount} análises arquivadas importadas. ${skippedCount} duplicadas foram ignoradas.`);
    });

    ocorrenciaForm.addEventListener('submit', (e) => {
        e.preventDefault();
         const editingItem = ocorrenciaListDiv.querySelector('.ocorrencia-item.editing');
        if (editingItem) {
            const saveBtn = editingItem.querySelector('.save-edit-ocorrencia-btn');
            if(saveBtn) saveBtn.click();
        }

        const taskId = parseInt(document.getElementById('ocorrencia-task-id').value);
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            const newOcorrencias = Array.from(ocorrenciaListDiv.querySelectorAll('.ocorrencia-item')).map(item => ({
                id: item.dataset.id,
                categoria: item.querySelector('.view-mode .desc-text').dataset.categoria,
                desc: item.querySelector('.view-mode .desc-text span.font-medium').textContent,
                horarioInicial: item.querySelector('.view-mode .time-text').dataset.start,
                horarioFinal: item.querySelector('.view-mode .time-text').dataset.end,
                isInconclusiva: !!item.querySelector('.view-mode span.bg-slate-400')
            }));
            task.ocorrencias = newOcorrencias;
            task.ocorrencia = newOcorrencias.length > 0 ? 'Sim' : 'Não';
        }
        ocorrenciaModal.classList.add('hidden');
        refreshUI();
    });
    
    taskList.addEventListener('change', (e) => {
        if (e.target.classList.contains('status-select')) {
            const taskId = parseInt(e.target.dataset.id);
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                if (e.target.dataset.type === 'backup') {
                    task.statusBackup = e.target.value;
                }
                if (e.target.dataset.type === 'analise') {
                    const oldStatus = task.statusAnalise;
                    task.statusAnalise = e.target.value;
                    
                    // Só define a data de conclusão se estiver mudando de um status NÃO-CONCLUÍDO para "Concluída"
                    if (task.statusAnalise === 'Concluída' && oldStatus !== 'Concluída') {
                        task.dataConclusao = new Date().toISOString().split('T')[0];
                    } else if (task.statusAnalise === 'Pendente') {
                        // Se voltar para Pendente, limpa a data de conclusão
                        task.dataConclusao = null;
                    }
                    // Se já estava "Concluída" e mudar para "Em Análise", ou qualquer outra combinação,
                    // a dataConclusao existente é mantida, não sendo nem atualizada nem apagada.
                }
                refreshUI();
            }
        }
    });

    const populateCategorySelect = (selectElement, selectedValue = '') => {
        selectElement.innerHTML = '';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            if (cat === selectedValue) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    };
    
    // *** 4. SUBSTITUIÇÃO: updateMultiOcVisuals ***
    const updateMultiOcVisuals = () => {
        const items = Array.from(ocorrenciaListDiv.querySelectorAll('.ocorrencia-item'));
        const startTimeMap = new Map();
        const isDarkMode = document.documentElement.classList.contains('dark');
        const defaultBg = isDarkMode ? '#334155' : '#f1f5f9'; // slate-700 / slate-100

        items.forEach(item => {
            item.style.backgroundColor = defaultBg;
        });

        items.forEach(item => {
            let startTime;
            if (item.classList.contains('editing')) {
                startTime = item.querySelector('.edit-start').value;
            } else {
                startTime = item.querySelector('.view-mode .time-text').dataset.start;
            }

            if (startTime) {
                if (!startTimeMap.has(startTime)) {
                    startTimeMap.set(startTime, []);
                }
                startTimeMap.get(startTime).push(item);
            }
        });

        let colorIndex = 0;
        for (const [startTime, groupedItems] of startTimeMap.entries()) {
            if (groupedItems.length > 1) {
                const color = multiOcColors[colorIndex % multiOcColors.length];
                groupedItems.forEach(item => {
                    item.style.backgroundColor = color;
                });
                colorIndex++;
            }
        }
    };

    // *** 6. SUBSTITUIÇÃO: renderOcorrenciaItemInModal ***
    const renderOcorrenciaItemInModal = (ocor) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'ocorrencia-item p-3 bg-slate-100 dark:bg-slate-700 rounded-md';
        itemDiv.dataset.id = ocor.id || Date.now();
        const descText = ocor.desc.replace(/.*: \s*/, '');
        const categoria = ocor.categoria || 'Outros';
        const inconclusivaBadge = ocor.isInconclusiva ? `<span class="text-xs font-semibold text-white bg-slate-400 dark:bg-slate-500 px-2 py-0.5 rounded-full ml-2">Inconclusiva</span>` : '';

        itemDiv.innerHTML = `
            <div class="view-mode">
                <div class="flex items-start justify-between">
                    <div class="flex-grow mr-2">
                        <p class="desc-text font-semibold text-slate-800 dark:text-slate-200" data-categoria="${categoria}">${categoria}: <span class="font-medium">${descText}</span></p>
                        <div class="flex items-center mt-1">
                            <p class="time-text text-sm text-slate-500 dark:text-slate-400" data-start="${ocor.horarioInicial || ''}" data-end="${ocor.horarioFinal || ''}">Horário: ${ocor.horarioInicial || 'N/A'} - ${ocor.horarioFinal || 'N/A'}</p>
                            ${inconclusivaBadge}
                        </div>
                    </div>
                     <div class="flex flex-col items-end flex-shrink-0 space-y-1">
                        <button type="button" class="edit-ocorrencia-item-btn text-xs bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200 px-2 py-0.5 rounded hover:bg-orange-200 dark:hover:bg-orange-800">Editar</button>
                        <button type="button" class="remove-ocorrencia-btn text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold text-xl leading-none">&times;</button>
                     </div>
                </div>
            </div>
            <div class="edit-mode hidden">
                 <div class="mb-2">
                     <label class="block text-xs font-medium text-slate-600 dark:text-slate-400">Categoria</label>
                     <select class="edit-categoria w-full border border-slate-300 dark:border-slate-600 rounded-md p-1 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"></select>
                 </div>
                 <div class="mb-2">
                    <label class="block text-xs font-medium text-slate-600 dark:text-slate-400">Descrição</label>
                    <textarea class="edit-desc w-full border border-slate-300 dark:border-slate-600 rounded-md p-1 mb-2 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">${descText}</textarea>
                 </div>
                <div class="flex gap-2">
                     <div class="w-full">
                        <label class="block text-xs font-medium text-slate-600 dark:text-slate-400">Início</label>
                        <input type="time" step="1" class="edit-start border border-slate-300 dark:border-slate-600 rounded-md p-1 text-sm w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" value="${ocor.horarioInicial || ''}">
                     </div>
                     <div class="w-full">
                        <label class="block text-xs font-medium text-slate-600 dark:text-slate-400">Fim</label>
                        <input type="time" step="1" class="edit-end border border-slate-300 dark:border-slate-600 rounded-md p-1 text-sm w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" value="${ocor.horarioFinal || ''}">
                     </div>
                </div>
                <div class="mt-2">
                    <label class="flex items-center">
                        <input type="checkbox" class="edit-inconclusiva h-4 w-4 text-orange-600 border-gray-300 dark:border-slate-600 rounded focus:ring-orange-500" ${ocor.isInconclusiva ? 'checked' : ''}>
                        <span class="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">Inconclusiva</span>
                    </label>
                </div>
                <div class="mt-2 text-right">
                     <button type="button" class="cancel-edit-ocorrencia-btn text-xs bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300 px-2 py-1 rounded hover:bg-slate-300 dark:hover:bg-slate-500 mr-1">Cancelar</button>
                    <button type="button" class="save-edit-ocorrencia-btn text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded hover:bg-green-200 dark:hover:bg-green-800">Salvar Edição</button>
                </div>
            </div>
        `;
        ocorrenciaListDiv.appendChild(itemDiv);
        
        const editSelect = itemDiv.querySelector('.edit-categoria');
        populateCategorySelect(editSelect, categoria);
    }


    addOcorrenciaBtn.addEventListener('click', () => {
        const descInput = document.getElementById('add-ocorrencia-desc');
        const startInput = document.getElementById('add-horario-inicial');
        const endInput = document.getElementById('add-horario-final');
        const categoriaSelect = document.getElementById('add-ocorrencia-categoria');
        const isInconclusiva = addOcorrenciaInconclusiva.checked;
        
        if (!descInput.value.trim()) {
            descInput.classList.add('border-red-500');
            setTimeout(() => descInput.classList.remove('border-red-500'), 2000);
            return;
        }

        const newStartTime = startInput.value;
        if (newStartTime) {
            const allItems = ocorrenciaListDiv.querySelectorAll('.ocorrencia-item');
            let isDuplicate = false;
            for (const item of allItems) {
                let existingStartTime;
                if (item.classList.contains('editing')) {
                    existingStartTime = item.querySelector('.edit-start').value;
                } else {
                    existingStartTime = item.querySelector('.view-mode .time-text').dataset.start;
                }
                if (existingStartTime && existingStartTime === newStartTime) {
                    isDuplicate = true;
                    break;
                }
            }
            if (isDuplicate) {
                showNotification('Já existe uma ocorrência com este mesmo horário inicial.');
                return;
            }
        }

        renderOcorrenciaItemInModal({
            id: Date.now(), 
            categoria: categoriaSelect.value,
            desc: descInput.value, 
            horarioInicial: startInput.value, 
            horarioFinal: endInput.value,
            isInconclusiva: isInconclusiva
        });
        descInput.value = ''; startInput.value = ''; endInput.value = '';
        addOcorrenciaInconclusiva.checked = false;
        categoriaSelect.value = categories[0] || 'Outros';
        updateMultiOcVisuals();
    });
    
     ocorrenciaListDiv.addEventListener('click', (e) => {
        const itemDiv = e.target.closest('.ocorrencia-item');
        if (!itemDiv) return;

        if (e.target.classList.contains('remove-ocorrencia-btn')) {
            itemDiv.remove();
            updateMultiOcVisuals();
        } else if (e.target.classList.contains('edit-ocorrencia-item-btn')) {
             ocorrenciaListDiv.querySelectorAll('.ocorrencia-item.editing').forEach(el => {
                 const cancelBtn = el.querySelector('.cancel-edit-ocorrencia-btn');
                 if(cancelBtn) cancelBtn.click();
            });
            itemDiv.classList.add('editing');
            itemDiv.querySelector('.view-mode').classList.add('hidden');
            itemDiv.querySelector('.edit-mode').classList.remove('hidden');
        } else if (e.target.classList.contains('save-edit-ocorrencia-btn')) {
            const newCategoria = itemDiv.querySelector('.edit-categoria').value;
            const newDesc = itemDiv.querySelector('.edit-desc').value;
            const newStart = itemDiv.querySelector('.edit-start').value;
            const newEnd = itemDiv.querySelector('.edit-end').value;
            const newInconclusiva = itemDiv.querySelector('.edit-inconclusiva').checked;

            if (newStart) {
                const otherItems = Array.from(ocorrenciaListDiv.querySelectorAll('.ocorrencia-item')).filter(item => item !== itemDiv);
                let isDuplicate = false;
                for (const item of otherItems) {
                    let existingStartTime;
                    if (item.classList.contains('editing')) {
                        existingStartTime = item.querySelector('.edit-start').value;
                    } else {
                        existingStartTime = item.querySelector('.view-mode .time-text').dataset.start;
                    }
                    if (existingStartTime && existingStartTime === newStart) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (isDuplicate) {
                    showNotification('Já existe outra ocorrência com este mesmo horário inicial.');
                    return;
                }
            }

            const descText = itemDiv.querySelector('.view-mode .desc-text');
            const timeTextParent = itemDiv.querySelector('.view-mode .time-text').parentElement;
            
            descText.innerHTML = `<span class="font-semibold text-slate-800 dark:text-slate-200">${newCategoria}:</span> <span class="font-medium">${newDesc}</span>`;
            descText.dataset.categoria = newCategoria;
            
            const newInconclusivaBadge = newInconclusiva ? `<span class="text-xs font-semibold text-white bg-slate-400 dark:bg-slate-500 px-2 py-0.5 rounded-full ml-2">Inconclusiva</span>` : '';
            timeTextParent.innerHTML = `
                <p class="time-text text-sm text-slate-500 dark:text-slate-400" data-start="${newStart}" data-end="${newEnd}">Horário: ${newStart || 'N/A'} - ${newEnd || 'N/A'}</p>
                ${newInconclusivaBadge}
            `;

            itemDiv.classList.remove('editing');
            itemDiv.querySelector('.view-mode').classList.remove('hidden');
            itemDiv.querySelector('.edit-mode').classList.add('hidden');
            updateMultiOcVisuals();
        } else if (e.target.classList.contains('cancel-edit-ocorrencia-btn')) {
             const descText = itemDiv.querySelector('.view-mode .desc-text');
            const timeText = itemDiv.querySelector('.view-mode .time-text');
            itemDiv.querySelector('.edit-categoria').value = descText.dataset.categoria;
            itemDiv.querySelector('.edit-desc').value = descText.querySelector('span.font-medium').textContent;
            itemDiv.querySelector('.edit-start').value = timeText.dataset.start;
            itemDiv.querySelector('.edit-end').value = timeText.dataset.end;
            itemDiv.querySelector('.edit-inconclusiva').checked = !!itemDiv.querySelector('.view-mode span.bg-slate-400');

            itemDiv.classList.remove('editing');
            itemDiv.querySelector('.view-mode').classList.remove('hidden');
            itemDiv.querySelector('.edit-mode').classList.add('hidden');
            updateMultiOcVisuals();
        }
    });

    taskList.addEventListener('click', (e) => {
        const targetButton = e.target.closest('.toggle-details-btn, .edit-ocorrencia-btn, .delete-task-btn, .archive-single-btn');
        if (!targetButton) return;
        
        const taskId = parseInt(targetButton.dataset.id);

        if (targetButton.classList.contains('toggle-details-btn')) {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.isExpanded = !task.isExpanded;
                refreshUI();
            }
        }
        
        if (targetButton.classList.contains('edit-ocorrencia-btn')) {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                populateCategorySelect(addOcorrenciaCategoriaSelect, categories[0] || 'Outros');
                document.getElementById('ocorrencia-task-id').value = task.id;
                ocorrenciaListDiv.innerHTML = '';
                 if (task.ocorrencias) {
                     task.ocorrencias.forEach(ocor => renderOcorrenciaItemInModal(ocor));
                }
                updateMultiOcVisuals();
                document.getElementById('add-ocorrencia-desc').value = '';
                document.getElementById('add-horario-inicial').value = '';
                document.getElementById('add-horario-final').value = '';
                addOcorrenciaInconclusiva.checked = false;
                ocorrenciaModal.classList.remove('hidden');
            }
        }

        if (targetButton.classList.contains('archive-single-btn')) {
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            
            if (taskIndex > -1) {
                const [taskToArchive] = tasks.splice(taskIndex, 1);
                taskToArchive.archivedReason = 'manual';
                archivedTasks.push(taskToArchive);
                
                refreshUI();
                showNotification('Análise arquivada manually.');
            }
        }

        if (targetButton.classList.contains('delete-task-btn')) {
            tasks = tasks.filter(t => t.id !== taskId);
            refreshUI();
        }
    });

    formCondominioInput.addEventListener('input', () => {
        const inputValue = formCondominioInput.value.toLowerCase();
        autocompleteList.innerHTML = '';
        if (inputValue.length === 0) {
            autocompleteList.classList.add('hidden');
            return;
        }
        const uniqueCondominios = [...new Set(tasks.map(task => task.condominio))];
        const suggestions = uniqueCondominios.filter(condo => condo.toLowerCase().startsWith(inputValue));
        if (suggestions.length > 0) {
            suggestions.forEach(suggestion => {
                const item = document.createElement('div');
                item.className = 'p-2 hover:bg-orange-100 cursor-pointer text-sm';
                item.textContent = suggestion;
                item.addEventListener('click', () => {
                    formCondominioInput.value = suggestion;
                    autocompleteList.classList.add('hidden');
                });
                autocompleteList.appendChild(item);
            });
            autocompleteList.classList.remove('hidden');
        } else {
            autocompleteList.classList.add('hidden');
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!formCondominioInput.contains(e.target) && !autocompleteList.contains(e.target)) {
            autocompleteList.classList.add('hidden');
        }
    });

    renameCondoBtn.addEventListener('click', () => {
        const uniqueCondominios = [...new Set([...tasks, ...archivedTasks].map(task => task.condominio))].sort();
        oldNameSelect.innerHTML = '<option value="">Selecione um condomínio</option>';
        uniqueCondominios.forEach(condo => {
            const option = document.createElement('option');
            option.value = condo;
            option.textContent = condo;
            oldNameSelect.appendChild(option);
        });
        newNameInput.value = '';
        renameModal.classList.remove('hidden');
    });


    renameCancelBtn.addEventListener('click', () => renameModal.classList.add('hidden'));

    renameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const oldName = oldNameSelect.value;
        const newName = newNameInput.value.trim();
        if (!oldName || !newName || oldName === newName) {
            renameModal.classList.add('hidden');
            return;
        }
        tasks.forEach(task => {
            if (task.condominio === oldName) {
                task.condominio = newName;
            }
        });
         archivedTasks.forEach(task => {
            if (task.condominio === oldName) {
                task.condominio = newName;
            }
        });
        renameModal.classList.add('hidden');
        refreshUI();
    });
    
    expandAllBtn.addEventListener('click', () => {
        tasks.forEach(t => t.isExpanded = true);
        refreshUI();
    });

    collapseAllBtn.addEventListener('click', () => {
        tasks.forEach(t => t.isExpanded = false);
        refreshUI();
    });
    
    const performAutoBackup = () => {
        const today = new Date().toISOString().split('T')[0];
        const lastBackupDate = localStorage.getItem('lastBackupDate');

        if (today !== lastBackupDate) {
             try {
                const allData = {
                    tasks: JSON.parse(localStorage.getItem('monitoramentoTasks')) || [],
                    archivedTasks: JSON.parse(localStorage.getItem('archivedTasks')) || [],
                    categories: JSON.parse(localStorage.getItem('monitoramentoCategorias')) || []
                };
                if (allData.tasks.length === 0 && allData.archivedTasks.length === 0) return;
                
                const dataStr = JSON.stringify(allData, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.download = `backup_automatico_${today}.json`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
                localStorage.setItem('lastBackupDate', today);
                console.log('Backup automático realizado com sucesso.');
            } catch (error) {
                console.error('Falha no backup automático:', error);
            }
        }
    };

    const performWeeklyArchive = () => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const lastResetStr = localStorage.getItem('lastResetDate');
        let shouldReset = false;

        if (!lastResetStr) {
            shouldReset = true;
        } else {
            const lastResetDate = new Date(lastResetStr + 'T00:00:00');
            const nextResetDate = new Date(lastResetDate);
            nextResetDate.setDate(lastResetDate.getDate() + 7);
            
            if (today >= nextResetDate) {
                shouldReset = true;
            }
        }

        if (shouldReset) {
            console.log("Realizando arquivamento semanal automático...");
            const currentDayOfWeek = today.getDay();
            const diffToMonday = today.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1);
            const mondayOfCurrentWeek = new Date(today.setDate(diffToMonday));
            mondayOfCurrentWeek.setHours(0, 0, 0, 0);
            const currentWeekNumber = getWeekNumber(mondayOfCurrentWeek);

            let tasksToArchive = [];
            let remainingTasks = [];
            let count = 0;

            tasks.forEach(task => {
                 if (task.dataAnalise && !isNaN(new Date(task.dataAnalise + 'T00:00:00'))) {
                    const taskDate = new Date(task.dataAnalise + 'T00:00:00');
                    const taskWeek = task.semanaDeTrabalho || 0;
                    if (taskDate < mondayOfCurrentWeek && (taskWeek < currentWeekNumber || taskWeek === 0) ) {
                        task.archivedReason = 'auto-weekly';
                        tasksToArchive.push(task);
                        count++;
                    } else {
                        remainingTasks.push(task);
                    }
                 } else {
                     remainingTasks.push(task);
                     console.warn(`Tarefa ${task.id} mantida pois a data de análise é inválida ou ausente.`);
                 }
            });

            if (count > 0) {
                archivedTasks.push(...tasksToArchive);
                tasks = remainingTasks;
                saveTasks();
                showNotification(`${count} análises de semanas anteriores foram arquivadas automaticamente.`);
                refreshUI();
            } else {
                 console.log("Nenhuma análise anterior à semana atual encontrada para arquivamento automático.");
            }

            localStorage.setItem('lastResetDate', todayStr);
        }
    };


    restoreBtn.addEventListener('click', () => {
        restoreInput.click();
    });

    restoreInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        fileToRestore = file;
        restoreConfirmModal.classList.remove('hidden');
        restoreInput.value = ''; 
    });

    restoreConfirmCancelBtn.addEventListener('click', () => {
        fileToRestore = null;
        restoreConfirmModal.classList.add('hidden');
    });

    restoreConfirmProceedBtn.addEventListener('click', () => {
        if (!fileToRestore) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data && Array.isArray(data.tasks) && Array.isArray(data.archivedTasks)) {
                    tasks = data.tasks;
                    archivedTasks = data.archivedTasks;
                } else if (Array.isArray(data)) {
                    tasks = data;
                    archivedTasks = [];
                } else {
                     throw new Error('Formato de arquivo inválido.');
                }
                
                if (data && Array.isArray(data.categories)) {
                    categories = data.categories;
                    saveCategories();
                }

                refreshUI();
                showNotification('Backup restaurado com sucesso!');
            } catch (error) {
                console.error('Erro ao restaurar backup:', error);
                showNotification('Erro ao ler o arquivo de backup. Verifique se o arquivo é válido.');
            } finally {
                fileToRestore = null;
                restoreConfirmModal.classList.add('hidden');
            }
        };
        reader.onerror = () => {
            showNotification('Não foi possível ler o arquivo selecionado.');
            fileToRestore = null;
            restoreConfirmModal.classList.add('hidden');
        };
        reader.readAsText(fileToRestore);
    });
    
    periodAnalysisBtn.addEventListener('click', () => {
        periodCategoryFilter.innerHTML = '<option value="">Todas Categorias</option>';
        categories.forEach(cat => {
            periodCategoryFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
        });
        periodResultsContent.classList.add('hidden');
        periodAnalysisModal.classList.remove('hidden');
    });
    periodAnalysisCloseBtn.addEventListener('click', () => periodAnalysisModal.classList.add('hidden'));
    
    actionsMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        actionsMenu.classList.toggle('hidden');
    });

    window.addEventListener('click', (e) => {
        if (!actionsMenu.classList.contains('hidden') && !actionsMenuContainer.contains(e.target)) {
            actionsMenu.classList.add('hidden');
        }
    });
    
    actionsMenu.addEventListener('click', () => {
        actionsMenu.classList.add('hidden');
    });

    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const period = e.target.dataset.period;
            const today = new Date();
            let startDate, endDate;

            if (period === 'this-week') {
                const dayOfWeek = today.getDay() || 7;
                const diff = today.getDate() - dayOfWeek + 1;
                startDate = new Date(today.getFullYear(), today.getMonth(), diff);
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 4);
            } else if (period === 'last-week') {
                const todayCopy = new Date();
                todayCopy.setDate(todayCopy.getDate() - 7);
                const dayOfWeek = todayCopy.getDay() || 7;
                const diff = todayCopy.getDate() - dayOfWeek + 1;
                startDate = new Date(todayCopy.getFullYear(), todayCopy.getMonth(), diff);
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 4);
            } else if (period === 'this-month') {
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            } else if (period === 'last-month') {
                startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                endDate = new Date(today.getFullYear(), today.getMonth(), 0);
            }
            periodStartDateInput.value = formatDateForInput(startDate);
            periodEndDateInput.value = formatDateForInput(endDate);
        });
    });

    const updatePeriodReportCharts = (baseFilteredTasks) => {
        const categoryData = baseFilteredTasks.reduce((acc, task) => {
            task.ocorrencias.forEach(ocor => {
                const cat = ocor.categoria || 'Outros';
                acc[cat] = (acc[cat] || 0) + 1;
            });
            return acc;
        }, {});
        periodCategoryChart.data.labels = Object.keys(categoryData);
        periodCategoryChart.data.datasets[0].data = Object.values(categoryData);
        periodCategoryChart.update();

        const categoryFiltro = periodCategoryFilter.value;
        const tasksForBarChart = !categoryFiltro ? baseFilteredTasks : baseFilteredTasks.filter(task => 
            task.ocorrencias.some(ocor => (ocor.categoria || 'Outros') === categoryFiltro)
        );
        
        const dataByCondo = tasksForBarChart.reduce((acc, task) => {
            if (!acc[task.condominio]) acc[task.condominio] = { ocorrencias: 0 };
            task.ocorrencias.forEach(ocor => {
                 if (!categoryFiltro || (ocor.categoria || 'Outros') === categoryFiltro) {
                     acc[task.condominio].ocorrencias += 1;
                 }
            });
            return acc;
        }, {});

        periodChart.data.labels = Object.keys(dataByCondo);
        periodChart.data.datasets[0].data = Object.values(dataByCondo).map(d => d.ocorrencias);
        periodChart.update();
    };

    // *** 11. SUBSTITUIÇÃO: generateReportBtn listener ***
    generateReportBtn.addEventListener('click', () => {
        const startDate = periodStartDateInput.value;
        const endDate = periodEndDateInput.value;
        if (!startDate || !endDate) {
            showNotification("Por favor, selecione as datas de início e fim.");
            return;
        }
        const analysisType = document.querySelector('input[name="analysis_type"]:checked').value;

        let allTasksForReport;
        allTasksForReport = [...tasks, ...archivedTasks];

        const filteredTasks = allTasksForReport.filter(task => {
            const dateToCompare = analysisType === 'dataConclusao' ? task.dataConclusao : task.dataAnalise;
            if (!dateToCompare) return false;
            return dateToCompare >= startDate && dateToCompare <= endDate;
        });

        const totalDias = filteredTasks.length;
        const uniquePdvs = new Set(filteredTasks.map(task => task.condominio)).size;
        const totalOcorrencias = filteredTasks.reduce((acc, task) => acc + (task.ocorrencias ? task.ocorrencias.length : 0), 0);

        document.getElementById('period-dias').textContent = totalDias;
        document.getElementById('period-pdv').textContent = uniquePdvs;
        document.getElementById('period-oc').textContent = totalOcorrencias;

        periodTaskList.innerHTML = '';
        if(filteredTasks.length > 0){
            filteredTasks.sort((a, b) => new Date(a.dataAnalise) - new Date(b.dataAnalise));
            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = 'text-sm p-2 bg-slate-100 dark:bg-slate-700 rounded-md flex justify-between items-center';
                li.innerHTML = `
                    <span class="text-slate-800 dark:text-slate-200"><strong>${task.condominio}</strong> - ${formatDate(task.dataAnalise)}</span>
                    <span class="font-bold ${task.ocorrencias && task.ocorrencias.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}">${task.ocorrencias ? task.ocorrencias.length : 0} ocorr.</span>
                `;
                periodTaskList.appendChild(li);
            });
        } else {
            periodTaskList.innerHTML = '<li class="text-sm text-slate-500 dark:text-slate-400 text-center">Nenhuma análise encontrada para o período.</li>';
        }

        updatePeriodReportCharts(filteredTasks);
        periodResultsContent.classList.remove('hidden');
    });
    
    periodCategoryFilter.addEventListener('change', () => {
         const startDate = periodStartDateInput.value;
        const endDate = periodEndDateInput.value;
        if (!startDate || !endDate) return;
         const analysisType = document.querySelector('input[name="analysis_type"]:checked').value;
         // CORREÇÃO: Usar todas as tarefas (ativas e arquivadas) ao filtrar categoria
         let allTasksForReport = [...tasks, ...archivedTasks];
         const filteredTasks = allTasksForReport.filter(task => {
            const dateToCompare = analysisType === 'dataConclusao' ? task.dataConclusao : task.dataAnalise;
            if (!dateToCompare) return false;
            return dateToCompare >= startDate && dateToCompare <= endDate;
        });
        updatePeriodReportCharts(filteredTasks);
    });
    
    annualReportBtn.addEventListener('click', () => {
        const currentYear = new Date().getFullYear();
        document.getElementById('annual-report-title').textContent = `Análise Anual (${currentYear})`;

        const allTasks = [...tasks, ...archivedTasks];
        const tasksThisYear = allTasks.filter(task => 
            task.dataConclusao && 
            new Date(task.dataConclusao + 'T00:00:00').getFullYear() === currentYear
        );
        
        const totalConcluidasAno = tasksThisYear.length;
        const totalOcorrenciasAno = tasksThisYear.reduce((acc, task) => acc + (task.ocorrencias ? task.ocorrencias.length : 0), 0);
        
        document.getElementById('annual-total-analises').textContent = totalConcluidasAno;
        document.getElementById('annual-total-ocorrencias').textContent = totalOcorrenciasAno;

        const monthlyData = new Array(12).fill(0);
        tasksThisYear.forEach(task => {
            if (task.ocorrencias && task.ocorrencias.length > 0) {
                const month = new Date(task.dataConclusao + 'T00:00:00').getMonth();
                monthlyData[month] += task.ocorrencias.length;
            }
        });
        annualMonthlyChart.data.datasets[0].data = monthlyData;
        annualMonthlyChart.update();

        const categoryData = tasksThisYear.reduce((acc, task) => {
            task.ocorrencias.forEach(ocor => {
                const cat = ocor.categoria || 'Outros';
                acc[cat] = (acc[cat] || 0) + 1;
            });
            return acc;
        }, {});
        annualCategoryChart.data.labels = Object.keys(categoryData);
        annualCategoryChart.data.datasets[0].data = Object.values(categoryData);
        annualCategoryChart.update();
        
        const condoData = tasksThisYear.reduce((acc, task) => {
            if (task.ocorrencias && task.ocorrencias.length > 0) {
                 acc[task.condominio] = (acc[task.condominio] || 0) + task.ocorrencias.length;
            }
            return acc;
        }, {});
        
        const sortedCondos = Object.entries(condoData)
                                 .sort((a, b) => b[1] - a[1])
                                 .slice(0, 10);

        annualCondoChart.data.labels = sortedCondos.map(item => item[0]);
        annualCondoChart.data.datasets[0].data = sortedCondos.map(item => item[1]);
        annualCondoChart.update();

        annualReportModal.classList.remove('hidden');
    });
    
    annualReportCloseBtn.addEventListener('click', () => {
        annualReportModal.classList.add('hidden');
    });

    // *** 7. SUBSTITUIÇÃO: renderPriorityView ***
    const renderPriorityView = () => {
        const allTasks = [...tasks, ...archivedTasks];
        const occurrenceMap = allTasks.reduce((acc, task) => {
            if (!acc[task.condominio]) {
                acc[task.condominio] = 0;
            }
            if (task.ocorrencias && task.ocorrencias.length > 0) {
                acc[task.condominio] += task.ocorrencias.length;
            }
            return acc;
        }, {});

        const pendingTasks = tasks.filter(task => task.statusBackup === 'Pendente' || task.statusAnalise === 'Pendente');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        pendingTasks.forEach(task => {
            const taskDate = new Date(task.dataAnalise + 'T00:00:00');
            const timeDiff = today.getTime() - taskDate.getTime();
            task.daysOverdue = Math.ceil(timeDiff / (1000 * 3600 * 24));
        });

        pendingTasks.sort((a, b) => {
            const scoreA = occurrenceMap[a.condominio] || 0;
            const scoreB = occurrenceMap[b.condominio] || 0;
            if (scoreB !== scoreA) {
                return scoreB - scoreA;
            }
            return new Date(a.dataAnalise) - new Date(b.dataAnalise);
        });

        priorityTaskList.innerHTML = '';

        if (pendingTasks.length === 0) {
            priorityTaskList.innerHTML = '<li class="text-center text-slate-500 dark:text-emerald-300 p-4 bg-emerald-50 dark:bg-emerald-900 rounded-md">Parabéns! Você está em dia com todas as análises.</li>';
            return;
        }

        pendingTasks.forEach(task => {
            let urgencyHTML = '';
            if (task.daysOverdue > 0) {
                urgencyHTML = `<span class="font-bold text-red-600 dark:text-red-400">Atrasado ${task.daysOverdue} dia(s)</span>`;
            } else if (task.daysOverdue === 0) {
                urgencyHTML = `<span class="font-bold text-amber-600 dark:text-amber-400">Para Hoje</span>`;
            } else {
                urgencyHTML = `<span class="font-semibold text-orange-600 dark:text-orange-400">Futuro (${formatDate(task.dataAnalise)})</span>`;
            }
            
            const historyScore = occurrenceMap[task.condominio] || 0;

            const li = document.createElement('li');
            li.className = 'p-3 bg-slate-100 dark:bg-slate-700 rounded-md flex justify-between items-center';
            li.innerHTML = `
                <div>
                    <p class="font-bold text-slate-800 dark:text-slate-200">${task.condominio}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Histórico: <strong>${historyScore}</strong> ocorrências</p>
                </div>
                <div class="text-right">
                    ${urgencyHTML}
                </div>
            `;
            priorityTaskList.appendChild(li);
        });
    };
    
    priorityBtn.addEventListener('click', () => {
        renderPriorityView();
        priorityModal.classList.remove('hidden');
    });

    priorityCloseBtn.addEventListener('click', () => {
        priorityModal.classList.add('hidden');
    });
    
    pdvDashboardBtn.addEventListener('click', () => {
        const uniqueCondominios = [...new Set([...tasks, ...archivedTasks].map(task => task.condominio))].sort();
        pdvSelect.innerHTML = '<option value="">Selecione um condomínio</option>';
        uniqueCondominios.forEach(condo => {
            pdvSelect.innerHTML += `<option value="${condo}">${condo}</option>`;
        });
        pdvContent.classList.add('hidden');
        pdvDashboardModal.classList.remove('hidden');
    });

    pdvDashboardCloseBtn.addEventListener('click', () => pdvDashboardModal.classList.add('hidden'));

    // *** 8. SUBSTITUIÇÃO: pdvSelect listener ***
    pdvSelect.addEventListener('change', () => {
        const selectedCondo = pdvSelect.value;
        if (!selectedCondo) {
            pdvContent.classList.add('hidden');
            return;
        }

        const allTasks = [...tasks, ...archivedTasks];
        const condoTasks = allTasks.filter(t => t.condominio === selectedCondo);

        const totalAnalises = condoTasks.length;
        const totalOcorrencias = condoTasks.reduce((acc, task) => acc + (task.ocorrencias ? task.ocorrencias.length : 0), 0);

        document.getElementById('pdv-total-analises').textContent = totalAnalises;
        document.getElementById('pdv-total-ocorrencias').textContent = totalOcorrencias;

        const monthlyData = {};
        for (let i = 11; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const label = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
            monthlyData[label] = 0;
        }

        condoTasks.forEach(task => {
            if (task.dataAnalise && task.ocorrencias && task.ocorrencias.length > 0) {
                 const d = new Date(task.dataAnalise + 'T00:00:00');
                 const label = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
                 if(monthlyData.hasOwnProperty(label)) {
                     monthlyData[label] += task.ocorrencias.length;
                 }
            }
        });

        pdvTrendChart.data.labels = Object.keys(monthlyData).map(label => new Date(label + '-01T00:00:00'));
        pdvTrendChart.data.datasets[0].data = Object.values(monthlyData);
        pdvTrendChart.update();

        const pdvTaskListUl = document.getElementById('pdv-task-list');
        pdvTaskListUl.innerHTML = '';
        if(condoTasks.length > 0) {
            condoTasks.sort((a,b) => new Date(b.dataAnalise) - new Date(a.dataAnalise));
            condoTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = 'text-sm p-2 bg-white dark:bg-slate-700 rounded-md flex justify-between items-center';
                li.innerHTML = `
                    <span><strong>${formatDate(task.dataAnalise)}</strong> (Semana ${task.semanaDeTrabalho || 'N/A'})</span>
                    <span class="font-bold ${task.ocorrencias && task.ocorrencias.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}">${task.ocorrencias ? task.ocorrencias.length : 0} ocorr.</span>
                `;
                pdvTaskListUl.appendChild(li);
            });
        } else {
             pdvTaskListUl.innerHTML = '<li class="text-sm text-slate-500 dark:text-slate-400 text-center">Nenhuma análise encontrada.</li>';
        }

        pdvContent.classList.remove('hidden');
    });


    archiveBtn.addEventListener('click', () => archiveModal.classList.remove('hidden'));
    archiveCancelBtn.addEventListener('click', () => archiveModal.classList.add('hidden'));

    archiveForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const days = parseInt(document.querySelector('input[name="archive_period"]:checked').value);
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - days);

        let tasksToArchive = [];
        let remainingTasks = [];

        tasks.forEach(task => {
            if (task.statusAnalise === 'Concluída' && task.dataConclusao && new Date(task.dataConclusao) < thresholdDate) {
                tasksToArchive.push(task);
            } else {
                remainingTasks.push(task);
            }
        });

        if (tasksToArchive.length > 0) {
            archivedTasks.push(...tasksToArchive);
            tasks = remainingTasks;
            refreshUI();
            showNotification(`${tasksToArchive.length} análises foram arquivadas.`);
        } else {
            showNotification("Nenhuma análise concluída encontrada para o período selecionado.");
        }
        archiveModal.classList.add('hidden');
    });

    // *** 9. SUBSTITUIÇÃO: renderArchiveList ***
    const renderArchiveList = () => {
        viewArchiveListContainer.innerHTML = '';
        unarchiveSelectedBtn.disabled = true;

        const searchTerm = archiveSearchInput.value.toLowerCase();
        const filteredArchived = archivedTasks.filter(task => 
            task.condominio.toLowerCase().includes(searchTerm)
        );

        if (filteredArchived.length > 0) {
            const list = document.createElement('ul');
            list.className = 'space-y-2';
            filteredArchived.sort((a,b) => new Date(b.dataConclusao || b.dataAnalise) - new Date(a.dataConclusao || a.dataAnalise));
            filteredArchived.forEach(task => {
                const li = document.createElement('li');
                li.className = 'p-2 bg-white dark:bg-slate-700 rounded-md text-sm flex justify-between items-center';
                li.innerHTML = `
                    <label class="flex items-center flex-grow mr-4">
                        <input type="checkbox" value="${task.id}" class="h-4 w-4 text-orange-600 border-gray-300 dark:border-slate-500 rounded focus:ring-orange-500 archive-checkbox mr-3">
                        <span class="ml-3 text-slate-800 dark:text-slate-200"><strong>${task.condominio}</strong> - Análise de ${formatDate(task.dataAnalise)}</span>
                    </label>
                    <span class="text-slate-500 dark:text-slate-400 text-xs flex-shrink-0">Concluído em: ${formatDate(task.dataConclusao)}</span>
                     <button data-id="${task.id}" class="unarchive-single-btn ml-4 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200 px-2 py-0.5 rounded hover:bg-orange-200 dark:hover:bg-orange-800">Desarquivar</button>
                `;
                list.appendChild(li);
            });
            viewArchiveListContainer.appendChild(list);
        } else {
             viewArchiveListContainer.innerHTML = '<p class="text-center text-slate-500 dark:text-slate-400">Nenhuma análise arquivada encontrada.</p>';
        }
    };

    viewArchiveBtn.addEventListener('click', () => {
        archiveSearchInput.value = '';
        renderArchiveList();
        viewArchiveModal.classList.remove('hidden');
    });

    viewArchiveCloseBtn.addEventListener('click', () => viewArchiveModal.classList.add('hidden'));
    
    archiveSearchInput.addEventListener('input', () => {
        renderArchiveList();
    });

       viewArchiveListContainer.addEventListener('click', (e) => {
           if (e.target.classList.contains('archive-checkbox')) {
                 const anyChecked = viewArchiveListContainer.querySelector('.archive-checkbox:checked');
                 unarchiveSelectedBtn.disabled = !anyChecked;
           }
        
           if (e.target.classList.contains('unarchive-single-btn')) {
                const taskId = parseInt(e.target.dataset.id);
                const taskIndex = archivedTasks.findIndex(t => t.id === taskId);
                if (taskIndex > -1) {
                    const [taskToUnarchive] = archivedTasks.splice(taskIndex, 1);
                    tasks.push(taskToUnarchive);
                    
                    renderArchiveList();

                    refreshUI();
                    showNotification(`Análise desarquivada.`);
                }
           }
       });


    unarchiveSelectedBtn.addEventListener('click', () => {
        const selectedIds = Array.from(viewArchiveListContainer.querySelectorAll('.archive-checkbox:checked'))
                                 .map(cb => parseInt(cb.value));
        
        if (selectedIds.length === 0) return;

        let tasksToUnarchive = [];
        let remainingArchived = [];

        archivedTasks.forEach(task => {
            if (selectedIds.includes(task.id)) {
                tasksToUnarchive.push(task);
            } else {
                remainingArchived.push(task);
            }
        });

        if (tasksToUnarchive.length > 0) {
            tasks.push(...tasksToUnarchive);
            archivedTasks = remainingArchived;
            renderArchiveList();
            refreshUI();
            
            if (archivedTasks.length === 0) {
                 viewArchiveModal.classList.add('hidden');
            }
            
            showNotification(`${tasksToUnarchive.length} análises foram desarquivadas.`);
        }
    });
    
    // *** 9. SUBSTITUIÇÃO: renderCategoryList ***
    const renderCategoryList = () => {
        categoryListContainer.innerHTML = '';
        if(categories.length === 0) {
             categoryListContainer.innerHTML = '<p class="text-center text-slate-500 dark:text-slate-400">Nenhuma categoria cadastrada.</p>';
             return;
        }
        categories.forEach(cat => {
            const div = document.createElement('div');
            div.className = 'flex justify-between items-center p-2 bg-white dark:bg-slate-700 rounded-md';
            div.innerHTML = `
                <span class="text-sm text-slate-800 dark:text-slate-200">${cat}</span>
                <button data-category="${cat}" class="delete-category-btn text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold text-lg leading-none">&times;</button>
            `;
            categoryListContainer.appendChild(div);
        });
    };

    categoryBtn.addEventListener('click', () => {
        renderCategoryList();
        categoryModal.classList.remove('hidden');
    });
    categoryCloseBtn.addEventListener('click', () => categoryModal.classList.add('hidden'));

    addCategoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newCat = newCategoryNameInput.value.trim();
        if (newCat && !categories.includes(newCat)) {
            categories.push(newCat);
            saveCategories();
            renderCategoryList();
            newCategoryNameInput.value = '';
        }
    });

    categoryListContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-category-btn')) {
            const catToDelete = e.target.dataset.category;
            categories = categories.filter(c => c !== catToDelete);
            saveCategories();
            renderCategoryList();
        }
    });
    
    // *** 10. SUBSTITUIÇÃO: plannerBtn listener ***
    plannerBtn.addEventListener('click', () => {
        const nextWeekNumber = getWeekNumber(new Date()) + 1;
        plannerWeekNumberInput.value = nextWeekNumber;

        const allTasks = [...tasks, ...archivedTasks];
        const occurrenceMap = allTasks.reduce((acc, task) => {
            if (!acc[task.condominio]) {
                acc[task.condominio] = 0;
            }
            if (task.ocorrencias && task.ocorrencias.length > 0) {
                acc[task.condominio] += task.ocorrencias.length;
            }
            return acc;
        }, {});

        const rankedCondos = Object.entries(occurrenceMap).sort((a, b) => b[1] - a[1]);

        plannerListContainer.innerHTML = '';
        if (rankedCondos.length === 0) {
            plannerListContainer.innerHTML = '<p class="text-center text-slate-500 dark:text-slate-400">Nenhum histórico de ocorrências encontrado para gerar sugestões.</p>';
            return;
        }

        rankedCondos.forEach(([condominio, count]) => {
             const label = document.createElement('label');
             label.className = 'flex items-center p-3 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-md cursor-pointer';
             label.innerHTML = `
                 <input type="checkbox" value="${condominio}" class="h-4 w-4 text-orange-600 border-gray-300 dark:border-slate-500 rounded focus:ring-orange-500 planner-checkbox" checked>
                 <span class="ml-3 text-sm font-medium text-slate-700 dark:text-slate-200">${condominio}</span>
                 <span class="ml-auto text-xs font-bold text-red-600 dark:text-red-400">${count} ocorr.</span>
             `;
             plannerListContainer.appendChild(label);
        });
        
        plannerModal.classList.remove('hidden');
    });
    
    plannerCancelBtn.addEventListener('click', () => {
        plannerModal.classList.add('hidden');
    });

    plannerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const weekNum = parseInt(plannerWeekNumberInput.value);
        if (!weekNum) {
            showNotification("Por favor, insira um número de semana válido.");
            return;
        }
        
        const selectedCondos = Array.from(plannerListContainer.querySelectorAll('.planner-checkbox:checked'))
                                      .map(cb => cb.value);
        
        if (selectedCondos.length === 0) {
             showNotification("Nenhum condomínio foi selecionado.");
             return;
        }
        
        const today = new Date().toISOString().split('T')[0];
        const year = new Date().getFullYear();
        const mondayOfTaskWeek = getDateOfISOWeek(weekNum, year);
        const dataAnalise = formatDateForInput(mondayOfTaskWeek);
        let newTasksCount = 0;
        let skippedCount = 0;

        selectedCondos.forEach((condominio, index) => {
            const isDuplicate = tasks.some(task => 
                task.condominio === condominio && 
                task.dataAnalise === dataAnalise &&
                task.semanaDeTrabalho === weekNum
            );

            if (isDuplicate) {
                skippedCount++;
                return;
            }

             const newTask = {
                id: Date.now() + index,
                dataSolicitacao: today,
                condominio: condominio,
                dataAnalise: dataAnalise,
                semanaDeTrabalho: weekNum,
                statusBackup: 'Pendente',
                dataBackup: '',
                statusAnalise: 'Pendente',
                ocorrencia: null,
                ocorrencias: [],
                acao: '',
                obs: 'Gerado pelo Planejador Semanal',
                isExpanded: true,
                dataConclusao: null,
            };
            tasks.push(newTask);
            newTasksCount++;
        });
        
        plannerModal.classList.add('hidden');
        refreshUI();
        showNotification(`${newTasksCount} tarefas geradas para a Semana ${weekNum}. ${skippedCount} duplicadas foram ignoradas.`);
    });


    setupCharts();
    performWeeklyArchive();
    refreshUI();
    performAutoBackup();
});