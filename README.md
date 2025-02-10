# LeetCode Solution Viewer
*************************************************************************************************************************************************************************
Problem Statement:  
Develop a web application that allows users to browse solutions for LeetCode problems by integrating with the GitHub API and fetching solutions from the haoel/leetcode GitHub repository.

            Key Features:
Search Functionality: Enable users to search for solutions using problem names or numbers (e.g., "Two Sum" or "1").
Solution Display: Fetch and display available solutions from GitHub, categorized by programming language (Python, Java, C++).
Code Snippet Viewer: Present syntax-highlighted code snippets and allow users to toggle between different programming languages.
Responsive Design: Ensure a seamless user experience across desktop and mobile devices.
*************************************************************************************************************************************************************************
LeetCode provides a vast collection of coding problems with solutions in various programming languages. However, navigating through GitHub repositories like haoel/leetcode to find specific solutions can be time-consuming and inefficient. The LeetCode Solution Viewer aims to solve this issue by providing a user-friendly web interface that allows users to:

* Search for LeetCode problems by name or number.
* Fetch solution files directly from the GitHub repository.
* Display solutions with proper syntax highlighting.
* Provide an organized way to explore solutions in different programming languages.
This project automates the process of locating and retrieving solutions, making it easier for users to access relevant code quickly.


Technologies Used and Their Role in the Project
1. HTML (HyperText Markup Language)
Role:
HTML provides the basic structure of the web page, ensuring that elements like search bars, buttons, and containers are properly placed.

Usage in This Project:

    Created an input field where users can enter a problem name or number.
    Added a dropdown menu for selecting a programming language.
    Included a button to trigger the search functionality.
    Used <div> elements to display the fetched solutions dynamically.
2. CSS (Cascading Style Sheets)
Role:
CSS is used to enhance the visual presentation of the web page, making it more readable and user-friendly.

Usage in This Project:

    Styled the search bar, buttons, and results container for a clean and responsive layout.
    Applied proper spacing, colors, and fonts to improve user experience.
     Used CSS classes and IDs to ensure a structured and well-formatted display.
3. JavaScript (JS) - The Core Functionality
Role:
JavaScript handles all the dynamic operations, including fetching data from GitHub, processing user input, and updating the UI.

Usage in This Project:

Fetching Data from GitHub API:
    ->Retrieved README.md from the repository to extract problem details and available languages.
    ->Constructed dynamic URLs to fetch solution files based on user input.
Processing and Extracting Data:
    ->Parsed the README.md to find the folder name and programming languages associated with a problem.
    ->Generated search URLs dynamically for different programming languages.
Displaying Results in the UI:
    ->Updated the web page dynamically by inserting solution content inside <pre> and <code> blocks.
    ->Displayed error messages if a problem or solution was not found.
Event Handling:
    ->Listened for button clicks and executed search functionality based on user input.