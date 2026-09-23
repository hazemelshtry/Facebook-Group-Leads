# Facebook Group Leads — Educational Browser Script

A single-file JavaScript demonstration of collecting user records from Facebook page responses, storing them locally, and exporting a CSV with profile links and personalized message drafts.

Built for the screen-recorded tutorial by Hazem El Shtry. No scraper extension, package installation, API key, or paid dependency is required by this file. It runs in a desktop browser page, not as a Node.js program.

**Source:** [facebook-group-leads.js](./facebook-group-leads.js)

**Video walkthrough:** [Watch the tutorial](https://www.youtube.com/watch?v=NCbjdHI3KxE)

## Educational purpose and responsible use

This project demonstrates browser JavaScript, handling network responses, IndexedDB storage, CSV generation, and text templates. An educational label does not grant permission to collect or use another person's information.

Use it only where you have the necessary authorization for the collection and subsequent use. Respect Meta's rules, applicable privacy requirements, and group rules. Access to a group does not by itself establish permission for automated collection or unsolicited outreach. Do not use this project to bypass access controls, harvest sensitive information, publish member lists, or send spam.

Meta describes restrictions on unauthorized automated collection in its [scraping guidance](https://about.fb.com/news/2021/12/expanding-bug-bounty-program-to-address-scraping/). Review the current [Automated Data Collection Terms](https://www.facebook.com/legal/automated_data_collection_terms) before use. This project is independent and is not affiliated with or endorsed by Meta or Facebook.

## Review status

Documentation is based on the supplied source reviewed on September 22, 2026. The source is preserved as supplied, including existing limitations. Offline checks use synthetic data; they do not establish that the current Facebook interface is compatible, that every member will be collected, or that using the script is authorized. No live account collection was performed during this review.

## What it does

- Adds a draggable panel with a stored-record count, **Download Members**, **Start Scrolling / Stop Scrolling**, and **Reset**.
- Observes completed `XMLHttpRequest` responses whose URL contains `/api/graphql/`.
- Parses compatible JSON and recursively collects `node` objects with an ID and `__typename === "User"`.
- Stores records in the current site's IndexedDB, using the member ID as the key.
- Scrolls the page to the bottom once per second when started.
- Builds a CSV with profile links, Messenger links, and an optional message template.

There is no built-in collection cap of 500. The tutorial's 500-record example is a demonstration size, not a configured maximum. Actual results remain limited by available responses, browser resources, access, and platform behavior.

## What it does not do

- It does not send messages, call ChatGPT, or generate offers with AI. Those actions in the tutorial are performed separately.
- It does not authenticate, join groups, unlock hidden data, or use the official Facebook Graph API.
- It does not verify buyer intent, qualify leads, or confirm that a profile can receive messages.
- It does not implement a group-specific filter or attach a source-group ID to records.
- It does not guarantee complete extraction, unlimited technical capacity, successful delivery, or protection from restrictions.

## Requirements

- A desktop browser with developer tools, IndexedDB, `XMLHttpRequest`, Blob downloads, and JavaScript enabled.
- A Facebook page you are authorized to access and collect from.
- Page responses matching the structure expected by the source. Browser API support alone does not ensure Facebook compatibility.
- A CSV reader such as Excel. Hyperlink formulas may behave differently with application, import settings, and locale.

No installation command is needed. Keep the file extension `.js`, for example `facebook-group-leads.js`; ensure your editor does not append `.txt`. Opening the file by double-clicking it is not the intended execution method.

## Before running it

Read the source first. Developer-console code executes inside the page you have open, with access available to that page context. Browser paste warnings are a real security safeguard, not an installation error; do not disable or bypass them simply to follow a tutorial. See [Chrome's explanation of self-XSS protection](https://developer.chrome.com/blog/self-xss).

This source explicitly reads matching response text and writes records to IndexedDB. It contains no explicit credential/cookie-reading code, third-party upload endpoint, analytics call, or external library download. This is a source-level observation, not a security certification of the browser, Facebook, or future versions of the file.

## Usage

1. Save and review [facebook-group-leads.js](./facebook-group-leads.js).
2. Open the relevant group member list in a fresh page session.
3. Open developer tools and select **Console**. Run the reviewed file's contents once in that page context only if authorized and you understand its behavior.
4. Let the database initialize before using the controls. The current implementation does not show a readiness indicator.
5. Click **Start Scrolling**. The script attempts to load more content by scrolling the page once per second. The panel counts records in its local store.
6. Click **Stop Scrolling** when you want to stop automatic page movement.
7. Click **Download Members**. Enter a message template if wanted, or leave it empty to export without messages. In this version, **Cancel also exports without messages**.
8. Open the downloaded CSV in an appropriate spreadsheet application. In Excel, adjust the column widths if needed.
9. Review each record and draft before any use. The links can open a profile or conversation; sending is your separate manual action.
10. Reload the page when finished to remove the script's interception and panel from that page session. Reloading does not delete its stored records.

To continue with another group, finish and export the current run first. The same database is reused on the same origin and browser profile; it does not automatically create separate lists for separate groups or Facebook accounts.

## Controls and lifecycle

| Control | Actual behavior |
|---|---|
| Counter | Counts records in IndexedDB, which can include previous sessions. It starts visually at zero and is not refreshed on database initialization. |
| Start Scrolling | Starts a one-second interval that scrolls the window to the bottom. Response interception already starts when the file runs. |
| Stop Scrolling | Clears the scrolling interval. It does not remove the response listener or stop collection from other matching requests. |
| Download Members | Reads the stored records, asks for a template, and generates a local CSV. It does not stop scrolling or clear the store. |
| Reset | Clears all records in this script's store without a confirmation prompt. It does not stop scrolling, remove interception, or delete downloaded files. Incoming responses may add records again. |
| Reload page | Removes the injected panel, timer, and interception for that page session; stored records remain. |

Run the source only once per page load. Running it again may produce an identifier-redeclaration error or duplicate UI/listeners depending on how it is executed. Reload before a new injection.

## CSV format

The filename is derived from the page title before the first `|`, followed by `.csv`; the browser may adjust invalid filename characters. This is **CSV, not XLSX**. The file begins with a UTF-8 BOM to help compatible spreadsheet applications interpret text.

| Column | Source or construction |
|---|---|
| Member Name | Trimmed `node.name`, or empty if absent |
| First Name | First space-separated part of Member Name; not a culturally aware name parser |
| Member ID | Written as an Excel-style text formula such as `="123"` |
| Account Link | `HYPERLINK` formula using `https://www.facebook.com/{id}/` |
| Send Message | `HYPERLINK` formula using `https://www.messenger.com/t/{id}` |
| Bio / Info | `node.bio_text.text`, when present; line breaks are replaced with spaces for export |
| Join Date | `join_status_text.text` from the enclosing object, when present; raw display text, not a verified or normalized date |
| Message | The personalized template plus a randomly generated reference suffix, or an empty cell |

Bio / Info and Join Date may be empty. The script does not extract dedicated email or telephone fields; free-form bio text may itself contain information, so review exported content before sharing it.

### Spreadsheet safety and compatibility

The CSV intentionally includes ID and hyperlink formulas. Ordinary text fields escape quotes but are **not sanitized against spreadsheet formula injection**: a name, bio, join text, or message starting with a formula trigger may be interpreted as a formula by some readers. CSV quoting alone is not a defense. Treat page text as untrusted; inspect in a text editor or import untrusted columns as text, and do not enable external content merely to open a file. Importing everything as text also makes intentional hyperlink formulas plain text.

The file has comma-separated columns and can contain quoted multiline message cells. A multiline message does not necessarily indicate a broken CSV. Locale-specific Excel settings may require using the CSV import interface instead of double-clicking the file. Hyperlink and ID formula support should be checked in your application.

## Message templates

Example:

```text
Hi First Name, would you like a short overview of how this could help your team?
```

The code replaces both `First Name` and `"First Name"`, case-insensitively, throughout the template. Use a single ordinary space between the two words. The quoted form means straight double quotes; curly quotation marks are not stripped by the quoted-token rule. Do not introduce braces such as `{{First Name}}`, because the braces would remain.

It uses the first space-separated part of the name. That may not be the person's preferred or complete first name. Check the result.

For each nonempty message, the current code appends a suffix similar to:

```text
[Ref: A1B2C]
```

The suffix is generated again at export time and is not a guaranteed-unique identifier. It does not prevent spam, make a message welcome, or protect an account from restrictions. The source prompt's claim that it is added “to prevent spam” is unsupported. This README documents that limitation rather than endorsing it.

An empty template or Cancel leaves the Message cells empty and still downloads the CSV. The template and generated message drafts are not stored in IndexedDB by this source; they appear in the exported file.

## Local storage and data handling

- Database: `fb-groups-list-storage`, version `5`.
- Object store: `members`.
- Key: `memberId`.
- Stored properties: `memberName`, `memberId`, `memberUrl`, `memberBio`, `joinDate`.

`put()` overwrites the existing record with the same ID. This avoids separate duplicate rows for that ID, but later incomplete records can replace earlier populated values. There is no source-group history, per-account partition, expiration policy, or automatic cleanup.

Storage belongs to the page origin in the browser profile. Closing a tab or logging out does not, by itself, cause this script to erase the database. Do not assume that switching Facebook accounts creates a separate dataset. Data on a different origin or browser profile is separate.

The script creates a Blob URL for the CSV and triggers a local browser download. The source has no explicit external upload destination. Facebook's existing page traffic continues, and clicking exported links navigates to Facebook or Messenger. “Local export” does not mean the page works offline or has no network traffic.

Protect downloaded files and collect only what you are authorized to use. Do not attach real lead lists, account identifiers, or access tokens to public bug reports.

### Removing collected data

For a durable cleanup, reload the page first so interception and scrolling are removed. Then use the browser's developer-tool storage view to delete only `fb-groups-list-storage` for that origin. This removes the stored records, not downloaded CSV files. Delete unwanted exports separately. Avoid clearing all Facebook site data unless you intentionally want the broader consequences, including possible sign-out.

Reset is convenient during a session but is not a complete shutdown or guaranteed durable cleanup while new responses are arriving.

## Known limitations and troubleshooting

| Symptom or concern | Explanation / next step |
|---|---|
| Zero records after running | Only future matching XHR responses are observed. Already-loaded records are not retrospectively scanned. Database initialization can also race with incoming responses. |
| Counter says zero but export has rows | The initial count is hard-coded to zero and does not load the saved count until a write/reset updates it. |
| Old records appear in a new group | Storage is shared across runs on the same origin/profile, with no group partition. Export and clear intentionally if separate lists are needed. |
| Scrolling stops loading content | The script scrolls the window, not a detected nested member-list container. It has no end-of-list detection or completion signal. Stop the timer rather than assuming more time guarantees more rows. |
| Missing profiles or metadata | Only compatible `User` nodes in parseable matching responses are collected. The code does not handle `fetch` traffic or all streamed/multipart/prefixed response formats. |
| Records unrelated to the selected group | The interceptor accepts any matching GraphQL XHR in that page session and has no operation or group filter. Review the export; do not interpret every captured user as verified group membership. |
| Reset refills immediately | It clears storage but leaves interception and scrolling active. Reload to stop the injected session. |
| Download after Cancel | Current intended code path: Cancel becomes an empty template and export continues. |
| File opens in one column / shows formulas | Check CSV import delimiter, locale, and whether formulas were imported as text. Do not enable unsafe external content. |
| “No members to download” | Storage is empty or not ready at the time it is read. |
| Storage errors or silent failures | Several errors are swallowed and initialization is not awaited. Review the console; the source does not provide a reliable error/recovery UI. |
| Large exports freeze the tab | All records and the full CSV are built in memory. Blob download does not guarantee million-record scalability. |

The current code has no explicit stop-at-count option, no rate-limit recovery, no background job service, and no progress acknowledgment that all pending database writes have completed before export.

## Technical overview

```text
Facebook page makes XHR requests
    → wrapper checks completed /api/graphql/ response text
    → parser traverses response.data for compatible User nodes
    → IndexedDB stores records keyed by memberId
    → Download reads the store and applies the message template
    → CSV is generated in memory and downloaded locally
```

The scrolling timer encourages the page to load more content. It is independent of the response observer. The supplied file does not preserve an externally accessible cleanup function to restore the original XHR method; reloading is the straightforward way to end the injected session.

## Reporting problems and contributing

When reporting an issue, include the browser version, the action taken, expected versus actual behavior, and a redacted error message. Use synthetic examples rather than real member data. Do not include cookies, credentials, tokens, or exported lead lists.

Useful improvements include explicit database readiness, a full stop/cleanup control, group-scoped records, safe CSV text handling, clearer reset/cancel behavior, and structured error reporting. These are proposals, not features of this version.



## Disclaimer

This educational demonstration is provided without a promise of compatibility, completeness, lead quality, business results, or account safety. You are responsible for obtaining appropriate authorization and handling collected information responsibly. This statement does not override platform rules or create permission to collect data.
