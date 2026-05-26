# 🏕️ Cheap Camping Map Project — Snapshot

## 📌 Project Overview

This project is a web-based camping map that helps users find **free or low-cost camping options (≤ $20/night)** across the U.S. Midwest.

### Core Goal
- Map budget-friendly campgrounds
- Focus states:
  - Nebraska
  - Iowa
  - South Dakota
  - Kansas

### Key Constraint
- Only include campgrounds that are:
  - Free OR
  - $20/night or less

---

## 🧱 System Architecture

The system is built as a simple data pipeline:  
Google Sheets (master database)  
↓  
Google Apps Script (data exporter)  
↓  
GitHub Repository (/data/*.json)  
↓  
GitHub Pages frontend (interactive map)  


---

## 📊 Data Schema

All campground entries must follow this schema:

```
name, state, town, cost, reservations, service, features, website, lat, lng
```
### Field definitions:
- name: campground or site name
- state: U.S. state
- town: nearest town or city
- cost: nightly cost (0–20)
- reservations: yes/no/limited
- service: primitive, electric, dispersed, etc.
- features: comma-separated highlights
- website: official or informational URL
- lat / lng: coordinates for mapping

---

## 📁 GitHub Repository Structure
camping-map/  
├── data/  
│   ├── nebraska.json  
│   ├── iowa.json  
│   ├── southdakota.json  
│   ├── kansas.json  
├── index.html  
├── app.js  
├── style.css  
├── README.md  
└── docs/  
    └── camping-map-project-snapshot.md  

---

## ⚙️ Google Sheets Setup

### Sheet name: 
Campgrounds
### Required columns (row 1 headers):
name | state | town | cost | reservations | service | features | website | lat | lng
### Notes:
- Each row = 1 campground
- This is the “source of truth”
- Script automatically groups by state

---


## 🤖 Apps Script Export System
### Main function:
- Reads Google Sheet
- Groups entries by state
- Converts to JSON
- Pushes to GitHub
### Core logic:
- Uses getDataRange().getValues()
- Builds JSON objects from headers
- Splits into state files
- Uploads via GitHub Contents API

---

## 🔐 GitHub Authentication
### Required:
- Personal Access Token
- Permissions:
  - Contents: Read and Write (fine-grained)
OR
  - repo scope (classic token)

---

## ⚠️ Known Issues (IMPORTANT)
### 1. Empty JSON files in GitHub
Cause:
- Failed or partial Apps Script writes
- Token permission errors
- Empty sheet rows
### 2. Frontend error: “Unexpected end of JSON input”
Cause:
- Corrupted or truncated JSON file
- Empty GitHub file
- Broken fetch response
### 3. GitHub API write failures
Cause:
- Token missing contents:write
- Wrong repo string format
- Fine-grained token not scoped correctly

---

## 🛠️ Frontend Safety Fix (recommended)
Always wrap JSON loading:
```
async function safeLoad(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed loading:", url, e);
    return [];
  }
}

```

## 🧪 Debug Strategy
### Step 1:
- Open JSON directly in browser:
```
/data/nebraska.json
```
- Check for:
  - empty file
  - HTML instead of JSON
  - truncated data
### Step 2:
- Check Apps Script logs:
  - ROW count
  - FINAL JSON length
  - GitHub API response

---

## 🚀 Current System Status (as built)
### Data sources:
Google Sheets (active)
### Export pipeline:
Apps Script → GitHub API
### Frontend:
- GitHub Pages map
- Loads multi-state JSON
### States included:
- Nebraska (partial / evolving)
- Iowa (CSV + JSON stage)
- South Dakota (draft complete)
- Kansas (draft complete)

---

## 🔮 Next Planned Improvements
1. Data validation layer
  Prevent empty JSON uploads
  Schema enforcement
2. Unified dataset option
  Combine all states into one file
3. Map improvements
  clustering
  filters (free vs paid)
  search bar
4. Reliability upgrades
  retry failed GitHub writes
  backup JSON versions
  rollback support

---

## 🧠 Mental Model
Think of this system as:
- Google Sheets = database
- Apps Script = backend ETL
- GitHub = storage
- GitHub Pages = frontend

---

## 📌 How to Resume This Project Later
When returning, provide:
- This snapshot file
- Current error (if any)
- Which state you’re working on

Then continue from:
- data layer
- script layer
- or frontend layer

## 🏁 End of Snapshot

---

If you want next upgrade, I can also turn this into a:

- `README.md` for GitHub (polished public project)
- architecture diagram (visual)
- or a “v2 system design” that fixes all your current JSON/GitHub issues permanently
