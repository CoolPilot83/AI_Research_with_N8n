import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodePropertyTypes,
} from 'n8n-workflow';
import * as fs from 'fs';
import * as path from 'path';

interface TicketCounter {
	[key: string]: number; // Format: "YYYYMM" -> counter
}

export class TicketGenerator implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ticket Generator',
		name: 'ticketGenerator',
		icon: 'file:ticket.svg',
		group: ['transform'],
		version: 1,
		description: 'Generate sequential ticket numbers based on year and month',
		defaults: {
			name: 'Ticket Generator',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Counter File Path',
				name: 'counterFilePath',
				type: 'string' as NodePropertyTypes,
				default: './ticket-counter.json',
				description: 'Path to the JSON file that stores the ticket counter',
				required: true,
			},
			{
				displayName: 'Ticket Number Format',
				name: 'ticketFormat',
				type: 'options' as NodePropertyTypes,
				options: [
					{
						name: 'YYYYMM-XXX',
						value: 'YYYYMM-XXX',
					},
					{
						name: 'YYYY-MM-XXX',
						value: 'YYYY-MM-XXX',
					},
					{
						name: 'YYMM-XXX',
						value: 'YYMM-XXX',
					},
				],
				default: 'YYYYMM-XXX',
				description: 'Format for the ticket number',
			},
			{
				displayName: 'Counter Padding',
				name: 'counterPadding',
				type: 'number' as NodePropertyTypes,
				default: 3,
				description: 'Number of digits for the counter (e.g., 3 = 001, 4 = 0001)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const counterFilePath = this.getNodeParameter('counterFilePath', 0) as string;
		const ticketFormat = this.getNodeParameter('ticketFormat', 0) as string;
		const counterPadding = this.getNodeParameter('counterPadding', 0) as number;

		// Get current date
		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth() + 1; // getMonth() returns 0-11
		const yearMonth = `${year}${month.toString().padStart(2, '0')}`;
		const yearMonthShort = `${year.toString().slice(-2)}${month.toString().padStart(2, '0')}`;

		// Load or create counter file
		let counters: TicketCounter = {};
		const absolutePath = path.isAbsolute(counterFilePath)
			? counterFilePath
			: path.resolve(process.cwd(), counterFilePath);

		try {
			if (fs.existsSync(absolutePath)) {
				const fileContent = fs.readFileSync(absolutePath, 'utf8');
				counters = JSON.parse(fileContent);
			}
		} catch (error) {
			console.warn(`Could not read counter file: ${error}`);
		}

		// Initialize counter for current year-month if it doesn't exist
		if (!counters[yearMonth]) {
			counters[yearMonth] = 0;
		}

		// Process each input item
		for (let i = 0; i < items.length; i++) {
			// Increment counter
			counters[yearMonth]++;

			// Generate ticket number based on format
			let ticketNumber: string;
			const counterStr = counters[yearMonth].toString().padStart(counterPadding, '0');

			switch (ticketFormat) {
				case 'YYYY-MM-XXX':
					ticketNumber = `${year}-${month.toString().padStart(2, '0')}-${counterStr}`;
					break;
				case 'YYMM-XXX':
					ticketNumber = `${yearMonthShort}-${counterStr}`;
					break;
				case 'YYYYMM-XXX':
				default:
					ticketNumber = `${yearMonth}-${counterStr}`;
					break;
			}

			// Save updated counters
			try {
				// Ensure directory exists
				const dir = path.dirname(absolutePath);
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true });
				}
				fs.writeFileSync(absolutePath, JSON.stringify(counters, null, 2), 'utf8');
			} catch (error) {
				throw new Error(`Failed to save counter file: ${error}`);
			}

			// Add ticket number to output
			returnData.push({
				json: {
					...items[i].json,
					ticketNumber,
					year,
					month,
					counter: counters[yearMonth],
				},
				pairedItem: {
					item: i,
				},
			});
		}

		return [returnData];
	}
}

