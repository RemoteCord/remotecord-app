"use client";

import { useState } from "react";

import { useWsClientContext } from "@/features/websocket/WsClient";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export const DownloadingFile: React.FC = () => {
	const { downloading, file } = useWsClientContext();
	const [openModal, setOpenModal] = useState<boolean>(false);

	return (
		<Dialog open={downloading}>
			<DialogContent>
				<DialogHeader className="flex flex-col gap-4">
					<DialogTitle className="flex gap-4 items-center">
						Downloading... {file.filename}
					</DialogTitle>
					<DialogDescription className="flex gap-8">
						{/* <Button onClick={handleAcceptConnection}>Accept</Button> */}
						<Progress
							value={file.progress}
							total={file.total}
							key={file.progress}
						/>
						{/* <Button variant={"destructive"} onClick={() => setOpenModal(false)}>
              Cancel
            </Button> */}
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};
