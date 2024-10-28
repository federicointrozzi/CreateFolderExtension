document.addEventListener("DOMContentLoaded", () => {
    const tabList = document.getElementById("tabList");
    const saveBtn = document.getElementById("saveBtn");
    const folderNameInput = document.getElementById("folderName");
    const selectAllCheckbox = document.getElementById("selectAll");

    // Using chrome.tabs.query API to get all tabs in the current window

    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        for (const tab of tabs) {
            // for each tab I create a <li> element with a checkbox and a label showing the title of the tab
            const listItem = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = tab.id;
            listItem.appendChild(checkbox);
            listItem.appendChild(document.createTextNode(tab.title));
            tabList.appendChild(listItem); // all these items are added to the tabList in the interface.
        }
    });

    // Select all checkboxes when the selectAllCheckbox is selected
    selectAllCheckbox.addEventListener("change", () => {
        const checkboxes = tabList.querySelectorAll("input[type=checkbox]");
        for (const checkbox of checkboxes) {
            checkbox.checked = selectAllCheckbox.checked;
        }
    });



    saveBtn.addEventListener("click", () => {
        const folderName = folderNameInput.value || "Saved Tabs"; // sets the folder name to the value of the input or "Saved Tabs" if the input is empty
        // Using the chrome.bookmarks.create API to create a folder,
        chrome.bookmarks.create({ title: folderName }, (folder) => {
            const checkedBoxes = tabList.querySelectorAll("input[type=checkbox]:checked"); // get all the checked checkboxes
            // so for each selected tab in the tabList, I create a bookmark in the folder
            for (let i = 0; i < checkedBoxes.length; i++){
                const box = checkedBoxes[i];
                const tabId = parseInt(box.value);
                chrome.tabs.get(tabId, (tab) => {
                    chrome.bookmarks.create({
                        parentId: folder.id,
                        title: tab.title,
                        url: tab.url
                    });
                });
            }
        });
        window.close(); // closes the popup window after saving the bookmarks
    });
});