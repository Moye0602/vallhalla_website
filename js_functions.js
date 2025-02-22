async function fetchAccountData() {
    try {
        // Fetch the main account data (assuming you have a file like accounts.json)
        const response = await fetch('accounts.json');
        const accounts = await response.json();

        const accountSummariesDiv = document.getElementById('account-summaries');

        accounts.forEach(account => {
            const accountSummaryDiv = document.createElement('div');
            accountSummaryDiv.classList.add('account-summary');

            // Construct the HTML content for each account summary
            accountSummaryDiv.innerHTML = `
                <h2>Account Number: ${account.number}</h2>
                <p>Time Delay: ${account.timeDelay} minutes | Days: ${account.days}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>$ Gain</th>
                            <th>$ Loss</th>
                            <th>Sum $</th>
                            <th>Min $</th>
                            <th>Day % Gain</th>
                            <th>% Loss</th>
                            <th>% Tot Gain $</th>
                            <th>Sold Ratio</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Global</td>
                            <td>${account.globalGain}</td>
                            <td>${account.globalLoss}</td>
                            <td>${account.sum}</td>
                            <td>${account.min}</td>
                            <td>${account.dayGain}</td>
                            <td>${account.loss}</td>
                            <td>${account.totGain}</td>
                            <td>${account.soldRatio}</td>
                            <td>${account.result}</td>
                        </tr>
                    </tbody>
                </table>
                <p>Profit Factor Win Positions: ${account.profitFactor}</p>
                <p>Win Equity Paper Holdings: ${account.winEquity}</p>
                <p>Paper Value: ${account.paperValue}</p>
                <p>Cash: ${account.cash}</p>
                <p>Account Value: ${account.acntValue}</p>
            `;

            accountSummariesDiv.appendChild(accountSummaryDiv);
        });
    } catch (error) {
        console.error('Error fetching account data:', error);
    }
}

fetchAccountData();


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

async function fetchAccountData() {
    // Main function to fetch and process account data
    const accounts = [];
    for (let accountNumber = 0; accountNumber < 5; accountNumber++) {
        const account = await loadPaperAccount(accountNumber);
        const history = await loadPaperHistoryMulti('2024-01-01', new Date().toISOString().slice(0, 10), accountNumber);
        accounts.push({ account, history, accountNumber });
    }
    processAndDisplayData(accounts);
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

fetchAccountData();