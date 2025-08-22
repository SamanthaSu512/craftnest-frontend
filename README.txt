Author: Samantha Su
Interactive Features:
1. Font Size Adjuster
- Buttons allow users to increase or decrease the font size of the entire page content.
- Located at the bottom of all pages.
- JavaScript function 'adjustFontSize(delta)' is triggered on click.
- Font sizes are defined in 'rem' so that scaling works consistently.
Expected behavior:
- Clicking "Increase Font Size" enlarges all text.
- Clicking "Decrease Font Size" reduces all text.
- Size changes apply dynamically without refreshing the page

2. Font Type Adjuster
- A '<select>' dropdown lets users change the font family on the page.
- Calls the JavaScript function 'setFontType(value)' on selection change.
Expected behavior:
- Selecting a font from the dropdown instantly changes the font family of all text on the page.