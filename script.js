async function fetchGithubToken() {
    try {
        const response = await fetch("http://localhost:5000/token");
        if (!response.ok) {
            throw new Error(`Failed to fetch token: ${response.status}`);
        }
        const data = await response.json();
        return data.token; // Assuming backend returns { "token": "your_token_here" }
    } catch (error) {
        console.error("Error fetching GitHub token:", error);
        return null;
    }
}

// Function to fetch the README file from GitHub
async function fetchReadme() {
    const url = "https://raw.githubusercontent.com/haoel/leetcode/master/README.md";

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch README: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Error fetching README:", error);
        return null;
    }
}

// Function to extract problem details (folder name, available languages)
function extractLeetCodeData(readmeText, query) {
    const regex = /\|(\d+)\|\[(.*?)\]\(.*?\)\s*\|\s*(.*?)\|/g;
    let match;

    while ((match = regex.exec(readmeText)) !== null) {
        const problemNumber = match[1];
        const problemTitle = match[2];
        const solutions = match[3];

        if (problemTitle.toLowerCase().includes(query.toLowerCase()) || problemNumber === query) {
            // Extract folder name and available languages
            const languageExtensions = [];
            let folderName = null;

            solutions.split(',').forEach(sol => {
                const langMatch = sol.match(/\.(\w+)\)/);
                if (langMatch) {
                    languageExtensions.push(langMatch[1]);
                }
                const pathMatch = sol.match(/\((.*?)\)/);
                if (pathMatch && !folderName) {
                    folderName = pathMatch[1].split('/').slice(-2, -1)[0];
                }
            });

            return { problemNumber, problemTitle, folderName, languages: languageExtensions };
        }
    }
    return null;
}

// Function to fetch the list of files in a problem's folder
async function fetchFolderFiles(language, folderName) {
    const folderUrl = `https://api.github.com/repos/haoel/leetcode/contents/algorithms/${language}/${folderName}`;
    const GITHUB_TOKEN = await fetchGithubToken();

    try {
        const response = await fetch(folderUrl, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch folder contents: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching folder contents:", error);
        return [];
    }
}

// Function to fetch the solution file
async function fetchSolutionFile(language, folderName) {
    const fileName = `${folderName}.${language}`;
    const fileUrl = `https://api.github.com/repos/haoel/leetcode/contents/algorithms/${language}/${folderName}/${fileName}`;
    const GITHUB_TOKEN = await fetchGithubToken();
    try {
        const response = await fetch(fileUrl, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });

        if (response.ok) {
            const fileData = await response.json();
            return atob(fileData.content); // Decode Base64 content
        }
    } catch (error) {
        console.error("Error fetching specific solution file:", error);
    }

    console.log("File not found, fetching first available file in the folder...");
    const folderFiles = await fetchFolderFiles(language, folderName);

    if (folderFiles.length > 0) {
        const firstFile = folderFiles[0].name;
        return await fetchFallbackFile(language, folderName, firstFile);
    }
    return `No solution file found for ${folderName}`;
}

// Function to fetch fallback file if main file is missing
async function fetchFallbackFile(language, folderName, fileName) {
    const fileUrl = `https://api.github.com/repos/haoel/leetcode/contents/algorithms/${language}/${folderName}/${fileName}`;
    const GITHUB_TOKEN = await fetchGithubToken();
    try {
        const response = await fetch(fileUrl, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });

        if (response.ok) {
            const fileData = await response.json();
            return atob(fileData.content);
        }
    } catch (error) {
        console.error("Error fetching fallback solution file:", error);
    }

    return `No available solution found in ${folderName}`;
}

// Function to display solutions
async function displaySolutions(query, selectedLanguage) {
    const readmeText = await fetchReadme();
    if (!readmeText) {
        console.error("Failed to fetch README");
        return;
    }

    const problemData = extractLeetCodeData(readmeText, query);
    if (!problemData) {
        alert('No matching problem found in README.');
        return;
    }

    const { problemTitle, folderName, languages } = problemData;

    if (!languages.includes(selectedLanguage)) {
        alert(`Solution not available in ${selectedLanguage.toUpperCase()}`);
        return;
    }

    console.log(`Fetching solution for: ${problemTitle} (${selectedLanguage})`);

    const solutionsContainer = document.getElementById('solutions-container');
    solutionsContainer.innerHTML = `<h2>Solution for: ${problemTitle} (${selectedLanguage.toUpperCase()})</h2>`;

    const solutionCode = await fetchSolutionFile(selectedLanguage, folderName);

    const codeBlock = document.createElement('pre');
    const codeContent = document.createElement('code');
    codeContent.textContent = solutionCode;
    codeBlock.appendChild(codeContent);

    solutionsContainer.appendChild(codeBlock);
}

// Event listener for search button
document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value.trim();
    const selectedLanguage = document.getElementById('language-select').value.trim().toLowerCase();

    if (!query) {
        alert('Please enter a problem name or number.');
        return;
    }
    if (!selectedLanguage) {
        alert('Please select a programming language.');
        return;
    }

    await displaySolutions(query, selectedLanguage);
});
