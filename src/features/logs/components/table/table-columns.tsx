"use client";

import type { Events } from "@/features/websocket/WsClient";
import type { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type LogEvent = {
	id: string;
	timestamp: string;
	type: Events;
	controller: string;
	context: string;
};

export const columns: ColumnDef<LogEvent>[] = [
	{
		accessorKey: "type",
		header: "Type",
	},
	{
		accessorKey: "timestamp",
		header: "Timestamp",
	},
	{
		accessorKey: "controller",
		header: "Controller",
	},
	{
		accessorKey: "context",
		header: "Context",
		id: "context",
		cell: ({ row }) => {
			const value = row.getValue("context") as string;
			const formatted = value.toString();
			return <div>{formatted}</div>;
		},
	},
];
