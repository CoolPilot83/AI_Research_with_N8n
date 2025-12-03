# n8n Ticket Generator Node

A custom n8n node that generates sequential ticket numbers based on the current year and month. The ticket number format includes the year, month, and an incrementing counter that resets each month.

## Features

- **Automatic Date Detection**: Uses the current year and month automatically
- **Sequential Counter**: Increments for each ticket generated, resets each month
- **Persistent Storage**: Saves counter state to a JSON file
- **Customizable Format**: Choose from multiple ticket number formats
- **Configurable Padding**: Set the number of digits for the counter

## Ticket Number Formats

- `YYYYMM-XXX` (default): e.g., `202501-001`, `202501-002`
- `YYYY-MM-XXX`: e.g., `2025-01-001`, `2025-01-002`
- `YYMM-XXX`: e.g., `2501-001`, `2501-002`

## Installation

### Method 1: Local Development Installation

1. **Navigate to your n8n custom nodes directory**:
   ```bash
   cd ~/.n8n/custom
   # Or on Windows:
   cd %USERPROFILE%\.n8n\custom
   ```

2. **Copy this node directory**:
   ```bash
   cp -r /path/to/n8n-ticket-generator .
   # Or on Windows:
   xcopy /E /I "C:\path\to\n8n-ticket-generator" "%USERPROFILE%\.n8n\custom\n8n-ticket-generator"
   ```

3. **Install dependencies**:
   ```bash
   cd n8n-ticket-generator
   npm install
   ```

4. **Build the node**:
   ```bash
   npm run build
   ```

5. **Restart n8n**:
   - If running n8n via npm: Stop and restart the n8n process
   - If running n8n via Docker: Restart the container
   - If running n8n Desktop: Restart the application

### Method 2: npm Package Installation

If you publish this as an npm package:

```bash
npm install n8n-nodes-ticket-generator
```

Then restart n8n.

## Usage

1. **Add the node to your workflow**:
   - Search for "Ticket Generator" in the node palette
   - Drag it into your workflow

2. **Configure the node**:
   - **Counter File Path**: Path to the JSON file that stores the counter (default: `./ticket-counter.json`)
     - Use an absolute path for a fixed location
     - Use a relative path relative to n8n's working directory
   - **Ticket Number Format**: Choose your preferred format
   - **Counter Padding**: Number of digits for the counter (default: 3, so 001, 002, etc.)

3. **Connect to other nodes**:
   - The node outputs the original data plus:
     - `ticketNumber`: The generated ticket number
     - `year`: The current year
     - `month`: The current month (1-12)
     - `counter`: The current counter value

## Example Workflow

```
Webhook → Ticket Generator → HTTP Request (Create Ticket)
```

The Ticket Generator node will:
- Receive data from the webhook
- Generate a unique ticket number (e.g., `202501-001`)
- Pass the data along with the ticket number to the next node

## Counter File Format

The counter file is stored as JSON:

```json
{
  "202501": 5,
  "202502": 12
}
```

The key is `YYYYMM` format, and the value is the last counter used for that month.

## Important Notes

- **File Permissions**: Ensure n8n has read/write permissions to the counter file path
- **Counter Reset**: The counter resets to 1 each month automatically
- **Thread Safety**: If running multiple n8n instances, consider using a shared database or file locking mechanism
- **Backup**: Consider backing up the counter file regularly

## Development

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

This will watch for changes and rebuild automatically.

### Linting

```bash
npm run lint
npm run lintfix
```

## Troubleshooting

### Build Errors on Windows with Paths Containing Special Characters

If you encounter errors like `'App' is not recognized` when building on Windows with paths containing spaces or special characters (like "AI & App Dev"), the build scripts have been configured to work around this by using Node.js directly instead of batch files.

If you still encounter issues:
- Ensure all dependencies are installed: `npm install`
- Try running the build command: `npm run build`
- The build scripts use `node node_modules/typescript/bin/tsc` directly to avoid path issues

### Node Not Appearing

- Ensure you've built the node (`npm run build`)
- Check that the node is in the correct directory (`~/.n8n/custom/` or `%USERPROFILE%\.n8n\custom\`)
- Restart n8n completely

### Counter File Errors

- Check file permissions
- Ensure the directory exists or use an absolute path
- Check n8n's working directory if using relative paths

### Counter Not Incrementing

- Verify the counter file is being written (check the file path)
- Check n8n logs for errors
- Ensure the file isn't locked by another process

## License

MIT

