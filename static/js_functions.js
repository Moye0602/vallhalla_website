


async function loadPaperAccount(accountNumber) {
    try {
        const response = await fetch(`../Vallhalla/Paper/${accountNumber}_paper_acnt.json`); // Updated path
        return await response.json();
    } catch (error) {
        console.error(`Error loading account data for account ${accountNumber}:`, error);
        return {
            Saved_at: new Date().toISOString(),
            cash: Math.pow(10, 1 + accountNumber),
            acnt: {},
            metrics: {},
            acnt_analytics: {}
        };
    }
}

async function combineMonthlyLogs(startDateStr, endDateStr, historySource) {
    try {
        const combinedData = {};
        const startDate = new Date(startDateStr);
        const endDate = endDateStr ? new Date(endDateStr) : new Date();
        const inputDirectory = historySource.includes('Paper/') ? `../Vallhalla/${historySource}` : `../Vallhalla/Live/`;

        // Fetch the directory listing (assuming the server provides it)
        const response = await fetch(inputDirectory);
        if (!response.ok) {
            throw new Error(`Failed to fetch directory listing from ${inputDirectory}: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();

        // Parse the HTML to extract filenames
        const parser = new DOMParser();
        const html = parser.parseFromString(text, 'text/html');
        const fileNames = Array.from(html.querySelectorAll('a'))
            .map(a => a.href.split('/').pop())
            .filter(filename => filename.endsWith(".json") && filename.includes('history') && !filename.includes('dup'));

        for (const filename of fileNames) {
            try {
                const fileDateStr = filename.split("_")[2].replace(".json", "");
                const fileDate = new Date(`${fileDateStr}-01`);

                if (startDate <= fileDate && fileDate <= endDate) {
                    const filePath = `${inputDirectory}/${filename}`;
                    const fileResponse = await fetch(filePath);
                    if (!fileResponse.ok) {
                        throw new Error(`Failed to fetch file ${filePath}: ${fileResponse.status} ${fileResponse.statusText}`);
                    }
                    const monthlyData = await fileResponse.json();

                    for (const dateStr in monthlyData) {
                        if (!combinedData[dateStr]) {
                            combinedData[dateStr] = {};
                        }
                        for (const ticker in monthlyData[dateStr]) {
                            combinedData[dateStr][ticker] = monthlyData[dateStr][ticker];
                        }
                    }
                }
            } catch (fileError) {
                console.error(`Error processing '${filename}':`, fileError);
            }
        }
        return combinedData;
    } catch (error) {
        console.error(`Error combining monthly logs:`, error);
        return {};
    }
}

async function loadPaperHistoryMulti(startDate, endDate, accountNumber) {
    // Load combined transaction history
    try {
        return await combineMonthlyLogs(startDate, endDate, `Paper/account_${accountNumber}`);
    } catch (error) {
        console.error(`Error loading paper history for account ${accountNumber}:`, error);
        return {};
    }
}



function processAndDisplayData(accounts) {
    // Process and display account data
    const accountSummariesDiv = document.getElementById('account-summaries');
    accountSummariesDiv.innerHTML = ''; // Clear previous data

    accounts.forEach(accountData => {
        // Process data for each account
        const processedData = processAccountData(accountData);
        // Create HTML for each account summary
        const accountSummaryDiv = createAccountSummaryHTML(processedData);
        accountSummariesDiv.appendChild(accountSummaryDiv);
    });
}

function processAccountData(accountData) {
    // Process account data and return a structured object
    // ... (Translate Python logic here)
    //Return the data in the same format as the python code.
}

function createAccountSummaryHTML(data) {
    // Create HTML elements to display account summary
    // ... (Generate HTML based on data)
}

async function fetchAccountData() {
    try {
        const accounts = [];
        for (let accountNumber = 0; accountNumber < 5; accountNumber++) {
            const account = await loadPaperAccount(accountNumber);
            const history = await loadPaperHistoryMulti('2024-01-01', new Date().toISOString().slice(0, 10), accountNumber);

            console.log(`Account ${accountNumber} data:`, account); // Log account data
            console.log(`Account ${accountNumber} history:`, history); // Log history data

            accounts.push({ account, history, accountNumber });
        }
        processAndDisplayData(accounts);
    } catch (error) {
        console.error("Error fetching account data:", error);
    }
}

fetchAccountData();