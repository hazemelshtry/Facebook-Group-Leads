# Facebook Group Leads

A lightweight browser-based JavaScript demonstration for learning how browser-side JavaScript can observe page responses, process user records, store data locally with IndexedDB, and export structured data to CSV.

> ⚠️ **Educational Use Only**
>
> This project is provided strictly for **educational, research, and demonstration purposes**. It is intended to demonstrate JavaScript, browser developer tools, IndexedDB, data processing, and CSV generation.
>
> You are responsible for how you use this code. Only use it with data and accounts you are authorized to access, and comply with applicable laws, privacy requirements, group rules, and platform terms. Do not use it for spam, harassment, unauthorized data collection, bypassing access controls, or other prohibited activity.
>
> This project is not affiliated with, sponsored by, or endorsed by Facebook or Meta.

**Video Tutorial:** [Watch the full walkthrough on YouTube](https://www.youtube.com/watch?v=NCbjdHI3KxE)

## Features

* Collects available member information from compatible Facebook page responses.
* Automatically scrolls the page to load additional content.
* Displays the number of collected records.
* Stores collected records locally using IndexedDB.
* Prevents separate duplicate records with the same member ID.
* Exports collected records to a CSV file.
* Generates direct profile links.
* Generates Messenger conversation links.
* Supports personalized message templates using `First Name`.
* Adds a unique reference code to generated message drafts.
* Includes a Reset button to clear collected records.
* Runs directly from the browser console.

## Data Exported

The generated CSV contains:

| Column       | Description                                       |
| ------------ | ------------------------------------------------- |
| Member Name  | Full name of the member                           |
| First Name   | First part of the member's name                   |
| Member ID    | Facebook user ID                                  |
| Account Link | Link to the member's Facebook profile             |
| Send Message | Link to the corresponding Messenger conversation  |
| Bio / Info   | Available profile bio information                 |
| Join Date    | Available group join information                  |
| Message      | Personalized message generated from your template |

Some fields may be empty when that information is not available in the page response.

## Requirements

* Desktop web browser with Developer Tools
* JavaScript enabled
* Authorized access to the relevant Facebook group/page
* Excel, Google Sheets, LibreOffice Calc, or another CSV-compatible application

No package installation, API key, browser extension, or paid dependency is required.

## How to Use

### 1. Open the Facebook Group

Open the relevant Facebook group and navigate to its members list.

### 2. Open Developer Tools

Right-click the page and select **Inspect**, or press:

```text
Ctrl + Shift + I
```

or:

```text
F12
```

Then select the **Console** tab.

### 3. Run the Script

Copy the contents of:

```text
facebook-group-leads.js
```

Paste the code into the Console and press **Enter**.

> **Security note:** Developer Console paste warnings exist to protect users from malicious code. Review and understand code before executing it. Do not run console code from sources you do not trust.

The control panel will appear on the page.

## Controls

### Start Scrolling

Click **Start Scrolling** to automatically scroll the page and load additional content.

The counter displays the number of member records currently stored.

Click **Stop Scrolling** whenever you want to stop automatic scrolling.

### Download Members

Click **Download Members** to export the collected records.

You will also have the option to provide a personalized message template.

### Reset

Click **Reset** to clear the member records stored by the script.

## Personalized Messages

Use:

```text
First Name
```

wherever you want the member's first name inserted.

For example:

```text
Hi First Name, I came across your profile and wanted to reach out.
```

For a member named `Bryan Smith`, the exported draft becomes:

```text
Hi Bryan, I came across your profile and wanted to reach out.
```

The script also recognizes:

```text
"First Name"
```

## Reference Codes

When a message template is provided, the script appends a short random reference code to each generated draft.

Example:

```text
Hi Bryan, I came across your profile and wanted to reach out.

[Ref: A1B2C]
```

The reference code changes between generated messages.

It is simply a generated reference value. **It does not guarantee protection from spam detection, messaging limits, account restrictions, or other platform enforcement.**

## CSV Export

The script exports a `.csv` file that can be opened with applications such as Microsoft Excel and Google Sheets.

It does **not** generate a native `.xlsx` workbook.

The filename is automatically derived from the current page title.

## How It Works

```text
Facebook loads page data
        ↓
The script observes compatible GraphQL XHR responses
        ↓
Compatible User records are detected
        ↓
Records are stored locally in IndexedDB
        ↓
Automatic scrolling loads additional page content
        ↓
Collected records are exported to CSV
```

Records are stored using their member ID as the key, preventing separate duplicate records for the same ID.

## Local Storage

Collected records are stored locally in the browser using IndexedDB.

The script does not contain an external server or upload destination for exporting the collected records.

Reloading the page stops the injected script and removes its interface, but previously stored records may remain in IndexedDB.

Use **Reset** when you want to clear the stored records.

## Important Notes

* The `500 members` demonstrated in the video is an example, not a built-in collection limit.
* The script does not automatically stop after reaching 500 records.
* Results depend on the information loaded by Facebook into compatible page responses.
* Some profiles may not contain bio or join information.
* The script does not automatically send Messenger messages.
* The **Send Message** column provides a link to the corresponding Messenger conversation.
* The **Message** column contains a draft generated from the template supplied during export.
* Facebook may change its website or internal response structure, which can affect compatibility.
* Reload the page before running another instance of the script.

## Troubleshooting

**No records are being collected:** Make sure additional content is loading after the script has started. The script observes new compatible responses and does not retrospectively process everything loaded before execution.

**Old records appear in another export:** Records can remain in IndexedDB between sessions. Use **Reset** before beginning a separate collection.

**Scrolling continues but the counter stops increasing:** The page may no longer be loading additional compatible records. Stop scrolling rather than assuming additional scrolling will always produce more results.

**CSV does not open correctly in Excel:** Use Excel's CSV import functionality and verify the comma delimiter. Regional Excel settings can affect CSV handling.

## Educational Purpose & Disclaimer

This repository and its accompanying video are provided **strictly for educational, research, and demonstration purposes**.

The project demonstrates concepts including:

* Browser JavaScript
* Developer Tools
* Network response processing
* IndexedDB
* Data transformation
* CSV generation
* Message templating

The code is **not intended to authorize or encourage unauthorized data collection, unsolicited bulk messaging, spam, harassment, circumvention of platform protections, or violations of privacy rights or platform policies**.

Access to information through a website or account does not necessarily grant permission to collect, store, redistribute, or use that information for another purpose.

Users are solely responsible for ensuring that their use of this project complies with applicable laws, regulations, privacy requirements, group rules, and the current terms and policies of the relevant platforms.

The author makes no guarantee regarding continued compatibility, completeness of collected data, messaging availability, account restrictions, or business results.

Facebook and Meta are trademarks of their respective owners. This project is independent and is **not affiliated with, sponsored by, authorized by, or endorsed by Meta or Facebook**.

## Video Tutorial

For the complete demonstration and explanation:

[**Watch the tutorial on YouTube →**](https://www.youtube.com/watch?v=NCbjdHI3KxE)

---

If you found the project useful, consider ⭐ starring the repository and subscribing to the YouTube channel for more tutorials.
