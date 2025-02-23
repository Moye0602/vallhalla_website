async function loadAccount(accountNumber=null) {
    try {
        if (typeof accountNumber=== "number"){
            const response = await fetch(`/Paper/${accountNumber}_paper_acnt.json`); // Corrected path
        }else if (accountNumber === "Live"){
            const response = await fetch(`/Live/Live_Account.json`); // Corrected path
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {

        console.error(`Error loading account data for live account:`, error);
        return null;
    }
}

async function combineMonthlyLogs(accountNumber) {
    try {
        if (typeof accountNumber=== "number"){
            const response = await fetch(`/Paper/account_${accountNumber}`); // Corrected path
        }else if (accountNumber === "Live"){
            const response = await fetch(`/Live/Live_Account`); // Corrected path
        };
        if (!response.ok) {
            throw new Error(`Failed to fetch directory listing from account name ${accountNumber}: ${response.status} NOT FOUND`);
        }
        const text = await response.text();
        // Assuming your directory listing is some text format that you need to parse.
        // Replace this with your actual parsing logic.
        const files = text.split('\n').filter(line => line.endsWith('.log')); // Example: filter for .log files

        let combinedLogs = [];
        for (const file of files) {
            if (accountNumber!== "number"){
                // path to paper accounts
                const logResponse = await fetch(`/Paper/account_${accountNumber}/${file}`); 
            }else {
                // path to live account
                const logResponse = await fetch(`/Live/Live_Account/${file}`); 
            };
            if (!logResponse.ok) {
                console.error(`Failed to fetch log file ${file}`);
                continue;
            }
            const logData = await logResponse.text();
            combinedLogs.push(logData);
        }
        return combinedLogs.join('\n');
    } catch (error) {
        console.error("Error combining monthly logs:", error);
        return null;
    }
}

async function loadHistoryMulti(accountNumber) {
    try {
        const combinedLogs = await combineMonthlyLogs(accountNumber);
        return combinedLogs;
    } catch (error) {
        console.error("Error loading history:", error);
        return null;
    }
}

async function fetchAccountData(accountType="Paper",accountNumber=null) {
    try {
        if (accountType=="Live"  && !accountNumber){
            accountNumber=accountType};
        const accountData = await loadAccount(accountNumber);
        const historyData = await loadHistoryMulti(accountNumber);

            return {
                account: accountData,
                history: historyData,
            };
        
    }catch (error) {
        console.error("Error fetching account data:", error);
        return null;
    }
}
// Example usage (adjust based on your actual HTML elements and triggers)
async function loadAndDisplayData(accountNumber) {

        const data = await fetchAccountData(accountNumber);
        if (data) {
            // Example: Display data in HTML elements
            console.log("account Data:", data.account);
            console.log("history Data:", data.history);
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



fetchAccountData("Live");// test case
