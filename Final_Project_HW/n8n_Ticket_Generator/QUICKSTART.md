# Quick Start Guide - n8n Ticket Generator

## Installation Steps

1. **Copy the node to n8n's custom directory**:

   **Windows:**
   ```powershell
   # Find your n8n custom directory (usually)
   $n8nCustom = "$env:USERPROFILE\.n8n\custom"
   
   # Copy the node
   Copy-Item -Path ".\n8n-ticket-generator" -Destination "$n8nCustom\n8n-ticket-generator" -Recurse
   ```

   **Linux/Mac:**
   ```bash
   cp -r n8n-ticket-generator ~/.n8n/custom/
   ```

2. **Install dependencies**:
   ```bash
   cd ~/.n8n/custom/n8n-ticket-generator  # or %USERPROFILE%\.n8n\custom\n8n-ticket-generator on Windows
   npm install
   ```

3. **Build the node**:
   ```bash
   npm run build
   ```

4. **Restart n8n**:
   - Stop n8n (Ctrl+C if running in terminal)
   - Start n8n again
   - The "Ticket Generator" node should now appear in the node palette

## Basic Usage

1. **Create a new workflow** in n8n
2. **Add a node** (e.g., Manual Trigger or Webhook)
3. **Add the Ticket Generator node**:
   - Search for "Ticket Generator" in the node palette
   - Connect it to your trigger node
4. **Configure the node**:
   - **Counter File Path**: `./ticket-counter.json` (or use an absolute path)
   - **Ticket Number Format**: Choose your preferred format
   - **Counter Padding**: 3 (for 001, 002, etc.)
5. **Test the workflow**:
   - Click "Execute Workflow"
   - Check the output - you should see a `ticketNumber` field

## Example Output

When you run the node, it will add these fields to your data:
```json
{
  "ticketNumber": "202501-001",
  "year": 2025,
  "month": 1,
  "counter": 1
}
```

Each time you run it in the same month, the counter increments:
- First run: `202501-001`
- Second run: `202501-002`
- Third run: `202501-003`

When the month changes, it automatically resets:
- January 31st: `202501-050`
- February 1st: `202502-001`

## Troubleshooting

**Node doesn't appear:**
- Make sure you ran `npm run build`
- Check that the node is in `~/.n8n/custom/` (or `%USERPROFILE%\.n8n\custom\` on Windows)
- Restart n8n completely

**Counter file errors:**
- Use an absolute path like `C:\data\ticket-counter.json` (Windows) or `/home/user/data/ticket-counter.json` (Linux)
- Ensure n8n has write permissions to that location

